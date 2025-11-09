export default function Footer() {
    return (
      <footer className="mt-12 py-6 text-center text-gray-400 border-t border-gray-700">
        <p>
          © {new Date().getFullYear()} Movie DB. Built with ❤️ using Next.js 15 &
          React 19.
        </p>
      </footer>
    );
  }
  