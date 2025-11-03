# iOS Calculator

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🔗 [Try Now](https://i-os-calculator-eight.vercel.app/)

![Calculator Preview](./screenshot.png)

> A pixel-perfect recreation of the iOS calculator with full functionality and keyboard support

## ✨ Features

- 🎨 **Authentic iOS Design** - Matches the look and feel of the native iOS calculator
- ⌨️ **Keyboard Support** - Full keyboard input for faster calculations
- 📱 **Responsive Design** - Works seamlessly on all screen sizes
- 🔢 **Complete Functionality** - All standard calculator operations
- 🎯 **Smart Display** - Dynamic font sizing for long numbers
- ⚡ **Error Handling** - Graceful handling of division by zero and overflow
- 🔄 **Context-Aware Percentage** - iOS-style percentage calculations
- 🌙 **Dark Theme** - Beautiful dark interface matching iOS aesthetic

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/SubhradeepNathGit/ios-calculator.git
   ```

2. **Navigate to project directory**
   ```bash
   cd ios-calculator
   ```

3. **Open in browser**
   ```bash
   open index.html
   ```
   Or simply drag `index.html` into your browser.

## 📁 Project Structure

```
ios-calculator/
│
├── index.html          # Main HTML structure
├── style.css           # iOS-inspired styling
├── script.js           # Calculator logic and functionality
└── README.md          # Project documentation
```

## 🎮 Usage

### Mouse/Touch Controls
- Click number buttons to input digits
- Click operator buttons (+, −, ×, ÷) to perform operations
- Click `=` to calculate result
- Click `AC/C` to clear (AC clears all, C clears current entry)
- Click `+/−` to toggle sign
- Click `%` for percentage calculations

### Keyboard Controls
- **Numbers**: `0-9`
- **Decimal**: `.`
- **Operators**: `+`, `-`, `*`, `/`
- **Calculate**: `Enter` or `=`
- **Clear**: `Escape` or `C`
- **Backspace**: `Backspace`
- **Percentage**: `%`

## 🔧 Technical Details

### Key Functions

- **Input Handling**: Limits input to 9 digits (like iOS)
- **Chain Calculations**: Supports continuous operations without pressing equals
- **Dynamic Display**: Auto-adjusts font size based on number length
- **Scientific Notation**: Automatically formats very large/small numbers
- **Error States**: Visual feedback for invalid operations

### Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🎨 Customization

You can easily customize the calculator by modifying the CSS variables:

```css
/* Colors */
--number-bg: #333;
--operator-bg: #ff9f0a;
--function-bg: #a5a5a5;
--text-color: #fff;
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Subhradeep Nath**

- GitHub: [@SubhradeepNathGit](https://github.com/SubhradeepNathGit)
- LinkedIn: [@Subhradeep-nath-dev](https://www.linkedin.com/in/subhradeep-nath-dev)

## 🙏 Acknowledgments

- Design inspired by Apple's iOS Calculator
- Built with vanilla JavaScript (no frameworks!)
- Icons and fonts from system defaults

