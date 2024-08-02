#ifndef SPICLASS_HPP_
#define SPICLASS_HPP_

#include <Arduino.h>

class SpiClass {
public:
  static uint8_t initialized;

  void begin(const uint8_t ss_pin,
              const uint8_t mosi_pin,
              const uint8_t miso_pin,
              const uint8_t sck_pin);


};

extern SpiClass SPI;

#endif
