export default function FloatingContact() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <a
                href="https://t.me/AhmedSFarahat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 hover:-translate-y-1 transition-all"
                aria-label="Contact us on Telegram"
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.601.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.202-.656-.639.135-.953l11.57-4.458c.535-.195 1.002.128.831.939z" />
                </svg>
            </a>
            <a
                href="https://wa.me/qr/DPIFTRQ4NI3VP1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 hover:-translate-y-1 transition-all"
                aria-label="Contact us on WhatsApp"
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M12.031 0C5.394 0 .004 5.385.004 12.022c0 2.115.553 4.191 1.603 6.01L.002 24l6.115-1.602c1.745.962 3.738 1.47 5.912 1.47 6.637 0 12.025-5.385 12.025-12.02S18.668 0 12.031 0zm0 19.98c-1.801 0-3.565-.483-5.111-1.4L6.5 18.33l-3.66.96.974-3.568-.276-.44c-.98-1.565-1.498-3.414-1.498-5.26 0-5.54 4.51-10.05 10.05-10.05 5.54 0 10.05 4.51 10.05 10.05s-4.51 10.05-10.05 10.05zm5.514-7.534c-.302-.15-1.792-.885-2.068-.985-.276-.1-.478-.15-.679.15-.202.302-.78 1-.956 1.202-.176.202-.352.226-.654.126-2.583-1.077-4.14-2.887-4.706-3.832-.176-.302.213-.257.653-1.144.1-.202.05-.377-.025-.528-.075-.15-.679-1.636-.93-2.24-.244-.59-.492-.51-.679-.52-.176-.008-.377-.01-.578-.01-.202 0-.528.075-.805.377-.276.302-1.056 1.03-1.056 2.515 0 1.484 1.08 2.918 1.232 3.12.15.202 2.138 3.262 5.176 4.568.723.312 1.287.498 1.727.638.726.23 1.386.197 1.907.12.585-.088 1.792-.732 2.043-1.438.252-.707.252-1.314.177-1.44-.076-.126-.277-.202-.579-.353z" />
                </svg>
            </a>
        </div>
    );
}
