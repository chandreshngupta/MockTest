function Footer() {
  try {
    return (
      <footer className="bg-gray-900 text-white py-12" data-name="footer" data-file="components/Footer.js">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                  <div className="icon-graduation-cap text-lg text-white"></div>
                </div>
                <span className="text-xl font-bold">ExamPro</span>
              </div>
              <p className="text-gray-400">Your partner in exam success</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Exams</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Bank PO</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SSC</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CAT</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GATE</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Study Material</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Previous Papers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ExamPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}