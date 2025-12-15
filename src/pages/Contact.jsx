export default function Contact() {
  return (
    <div class="flex justify-center flex-col items-center min-h-screen max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>

      <form className="bg-white shadow rounded p-6 space-y-4 max-w-md">
        <input className="w-full border p-2 rounded" placeholder="Your Name" />
        <input className="w-full border p-2 rounded" placeholder="Your Email" />
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          placeholder="Your Message"
        ></textarea>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Send Message
        </button>
      </form>
    </div>
  );
}
