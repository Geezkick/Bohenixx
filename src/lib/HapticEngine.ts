/**
 * HapticEngine
 * A utility class to handle tactile feedback across the application.
 * Uses the navigator.vibrate API where supported.
 */

class HapticEngine {
  private static isSupported(): boolean {
    return typeof window !== "undefined" && "vibrate" in navigator;
  }

  /** Light, sharp tap (e.g., UI element press, tab switch) */
  static light() {
    if (this.isSupported()) {
      navigator.vibrate(10);
    }
  }

  /** Medium tap (e.g., success action, warning) */
  static medium() {
    if (this.isSupported()) {
      navigator.vibrate(25);
    }
  }

  /** Heavy, long vibration (e.g., error, pull-to-refresh snap) */
  static heavy() {
    if (this.isSupported()) {
      navigator.vibrate(50);
    }
  }

  /** Success pattern (two quick taps) */
  static success() {
    if (this.isSupported()) {
      navigator.vibrate([15, 50, 15]);
    }
  }

  /** Error pattern (three quick heavy taps) */
  static error() {
    if (this.isSupported()) {
      navigator.vibrate([30, 40, 30, 40, 50]);
    }
  }
}

export default HapticEngine;
