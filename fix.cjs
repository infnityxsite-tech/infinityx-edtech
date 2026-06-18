const fs = require('fs');

// 1. CoursesManager.tsx (Remove restrictions + fix duration mapping)
let cm = fs.readFileSync('client/src/components/admin/CoursesManager.tsx', 'utf8');
cm = cm.replace('if (module.lessons.length <= 1) return toast.error("A module needs at least 1 lesson");', '');
cm = cm.replace('if (modules.length <= 1) return toast.error("Need at least 1 module");', '');
cm = cm.replace('if (modules.length <= 1) return toast.error("A course needs at least 1 module");', '');
// Add duration back when saving
cm = cm.replace('videoUrl: l.videoUrl.trim() || undefined,\n                materials: l.materials.filter', 'videoUrl: l.videoUrl.trim() || undefined,\n                duration: l.duration.trim() || undefined,\n                materials: l.materials.filter');
cm = cm.replace('videoUrl: l.videoUrl.trim() || undefined,\n                  materials: l.materials.filter', 'videoUrl: l.videoUrl.trim() || undefined,\n                  duration: l.duration.trim() || undefined,\n                  materials: l.materials.filter');
// Actually, earlier in CoursesManager we did mapping on line 364
cm = cm.replace('videoUrl: l.videoUrl,\n                  materials: l.materials,', 'videoUrl: l.videoUrl,\n                  duration: l.duration || "",\n                  materials: l.materials,');
fs.writeFileSync('client/src/components/admin/CoursesManager.tsx', cm);

// 2. LearningPortal.tsx (quiz score local storage and Try Again, and progress bar)
let lp = fs.readFileSync('client/src/pages/LearningPortal.tsx', 'utf8');
if (!lp.includes('previousScore')) {
    lp = lp.replace('const [finished, setFinished] = useState(false);', `const [finished, setFinished] = useState(false);
    const [previousScore, setPreviousScore] = useState<number | null>(() => {
        const saved = localStorage.getItem(\`quiz_score_\${lessonId}\`);
        return saved !== null ? parseInt(saved) : null;
    });`);
    lp = lp.replace('setCurrent(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false);', `setCurrent(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false);
        const saved = localStorage.getItem(\`quiz_score_\${lessonId}\`);
        setPreviousScore(saved !== null ? parseInt(saved) : null);`);
    lp = lp.replace('if (isLoading) return', `useEffect(() => {
        if (finished) {
            localStorage.setItem(\`quiz_score_\${lessonId}\`, score.toString());
            setPreviousScore(score);
        }
    }, [finished, score, lessonId]);\n\n    if (isLoading) return`);
    lp = lp.replace('<Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onAllDone}>\n                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Lesson Complete\n                </Button>', `<div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onAllDone}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Lesson Complete
                    </Button>
                    <Button variant="outline" onClick={() => { setCurrent(0); setSelected(null); setSubmitted(false); setScore(0); setFinished(false); }}>
                        Try Again
                    </Button>
                </div>`);
    lp = lp.replace('<span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium">', `<div className="flex items-center gap-3">
                    {previousScore !== null && current === 0 && !submitted && (
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium">
                            Previous trial: {previousScore}/{quizzes.length}
                        </span>
                    )}
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium">`);
    lp = lp.replace('{current + 1} / {quizzes.length}\n                </span>\n            </div>', '{current + 1} / {quizzes.length}\n                    </span>\n                </div>\n            </div>');
}
fs.writeFileSync('client/src/pages/LearningPortal.tsx', lp);

// 3. CoursePreview.tsx (Remove resources attachments)
let cp = fs.readFileSync('client/src/pages/CoursePreview.tsx', 'utf8');
cp = cp.replace('{lesson.materials && lesson.materials.length > 0 && (\n                                                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">\n                                                            <BookOpen className="w-3 h-3" /> {lesson.materials.length} resources attachments\n                                                        </p>\n                                                    )}', '');
fs.writeFileSync('client/src/pages/CoursePreview.tsx', cp);

// 4. db.ts (lessonCount and duration)
let db = fs.readFileSync('server/db.ts', 'utf8');
if (!db.includes('COUNT(l.id)::int as "lessonCount"')) {
    db = db.replace('`SELECT id, course_id as "courseId", title, order_index as "orderIndex"\n     FROM modules WHERE course_id = $1 ORDER BY order_index ASC`,', '`SELECT m.id, m.course_id as "courseId", m.title, m.order_index as "orderIndex",\n            COUNT(l.id)::int as "lessonCount"\n     FROM modules m\n     LEFT JOIN lessons l ON m.id = l.module_id\n     WHERE m.course_id = $1 \n     GROUP BY m.id\n     ORDER BY m.order_index ASC`,');
}
if (!db.includes('video_url, duration, is_preview')) {
    db = db.replace('INSERT INTO lessons (module_id, title, video_url, is_preview, order_index)\n           VALUES ($1, $2, $3, $4, $5) RETURNING id', 'INSERT INTO lessons (module_id, title, video_url, duration, is_preview, order_index)\n           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id');
    db = db.replace('[moduleId, lesson.title, lesson.videoUrl, lesson.isPreview || false, lesson.orderIndex]', '[moduleId, lesson.title, lesson.videoUrl, lesson.duration || null, lesson.isPreview || false, lesson.orderIndex]');
    
    db = db.replace('INSERT INTO lessons (module_id, title, video_url, is_preview, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING id', 'INSERT INTO lessons (module_id, title, video_url, duration, is_preview, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id');
    db = db.replace('[moduleId, lesson.title, lesson.videoUrl, lesson.isPreview || false, lesson.orderIndex]', '[moduleId, lesson.title, lesson.videoUrl, lesson.duration || null, lesson.isPreview || false, lesson.orderIndex]');

    db = db.replace('video_url as "videoUrl", is_preview as "isPreview"', 'video_url as "videoUrl", duration, is_preview as "isPreview"');
    db = db.replace('video_url as "videoUrl", \n            is_preview as "isPreview"', 'video_url as "videoUrl", duration, \n            is_preview as "isPreview"');
}
fs.writeFileSync('server/db.ts', db);
console.log('done!');
