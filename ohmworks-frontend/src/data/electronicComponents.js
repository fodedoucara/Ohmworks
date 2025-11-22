export const COMPONENT_LIBRARY = [
  // ===========================
  // Passive Components
  // ===========================
  {
    id: "resistor",
    name: "Resistor",
    category: "Passive",
    defaultProps: { resistance: 1000 }   // 1kΩ common lab value
  },
  {
    id: "capacitor",
    name: "Capacitor",
    category: "Passive",
    defaultProps: { capacitance: 0.1, unit: "uF" }
  },
  {
    id: "inductor",
    name: "Inductor",
    category: "Passive",
    defaultProps: { inductance: 10, unit: "mH" }
  },

  // ===========================
  // Diodes / LEDs
  // ===========================
  {
    id: "led",
    name: "LED",
    category: "Diodes",
    defaultProps: { color: "red", forwardVoltage: 2.0 }
  },
  {
    id: "rgb_led",
    name: "RGB LED",
    category: "Diodes",
    defaultProps: { type: "common_cathode" }
  },
  {
    id: "diode",
    name: "Diode",
    category: "Diodes",
    defaultProps: { forwardVoltage: 0.7 }
  },

  // ===========================
  // Switches / Inputs
  // ===========================
  {
    id: "pushbutton",
    name: "Pushbutton",
    category: "Switches",
    defaultProps: { momentary: true }
  },
  {
    id: "toggle_switch",
    name: "Toggle Switch",
    category: "Switches",
    defaultProps: { positions: 2 }
  },
  {
    id: "potentiometer",
    name: "Potentiometer",
    category: "Switches",
    defaultProps: { resistance: 10000 } // 10kΩ
  },

  // ===========================
  // Sensors
  // ===========================
  {
    id: "temperature_sensor",
    name: "Temperature Sensor (LM35)",
    category: "Sensors",
    defaultProps: { range: "-55°C to 150°C" }
  },
  {
    id: "light_sensor",
    name: "Photoresistor (LDR)",
    category: "Sensors",
    defaultProps: {}
  },
  {
    id: "ultrasonic_sensor",
    name: "Ultrasonic Sensor (HC-SR04)",
    category: "Sensors",
    defaultProps: { range: "2cm–400cm" }
  },

  // ===========================
  // Displays
  // ===========================
  {
    id: "seven_segment",
    name: "7-Segment Display",
    category: "Displays",
    defaultProps: { digits: 1 }
  },
  {
    id: "lcd_16x2",
    name: "LCD 16x2",
    category: "Displays",
    defaultProps: { interface: "parallel" }
  },
  {
    id: "oled_display",
    name: "OLED Display (128x64)",
    category: "Displays",
    defaultProps: { protocol: "I2C" }
  },

  // ===========================
  // Microcontrollers / Boards
  // ===========================
  {
    id: "arduino_uno",
    name: "Arduino Uno",
    category: "Microcontrollers",
    defaultProps: { pins: 20 }
  },
  {
    id: "esp32",
    name: "ESP32",
    category: "Microcontrollers",
    defaultProps: { wifi: true, bt: true }
  },
  {
    id: "raspberry_pi_pico",
    name: "Raspberry Pi Pico",
    category: "Microcontrollers",
    defaultProps: { pins: 26 }
  },

  // ===========================
  // Power Sources
  // ===========================
  {
    id: "battery",
    name: "Battery",
    category: "Power",
    defaultProps: { voltage: 9 }
  },
  {
    id: "power_supply",
    name: "DC Power Supply",
    category: "Power",
    defaultProps: { voltage: 5 }
  },

  // ===========================
  // Breadboards / Connectivity
  // ===========================
  {
    id: "breadboard",
    name: "Breadboard",
    category: "Connectivity",
    defaultProps: { rows: 30 }
  },
  {
    id: "jumper_wire",
    name: "Jumper Wire",
    category: "Connectivity",
    defaultProps: { color: "red" }
  }
];
