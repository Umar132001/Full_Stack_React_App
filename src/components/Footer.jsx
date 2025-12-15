export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
        © {new Date().getFullYear()} John Doe. All rights reserved.
      </div>
    </footer>
  );
}
