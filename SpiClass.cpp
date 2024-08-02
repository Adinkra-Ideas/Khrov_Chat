#include "SpiClass.hpp"

uint8_t SpiClass::initialized = 0;

SpiClass SPI;

void SpiClass::begin(const uint8_t ss_pin,
                      const uint8_t mosi_pin,
                      const uint8_t miso_pin,
                      const uint8_t sck_pin)
{
  uint8_t sreg = SREG;  // SREG is system call
  noInterrupts();       // from <Arduino.h> Disables all interrupts by clearing the global interrupt mask
  if (!initialized)     // initialized var is naturally false on startup, therefore, this means onStartup
  {
    // Set PIN_SPI_SS to high so a connected chip will be "deselected" by default
    uint8_t port = digitalPinToPort(ss_pin);
    uint8_t bit = digitalPinToBitMask(ss_pin);
    volatile uint8_t *reg = portModeRegister(port);
    // All the above 3 sentences are calling Arduino system. 
    // It seems like they are making Arduino drop any previous slave (SS)
    // that it was currently connected to. It does this by setting the Pinout
    // of our connected CAN module(PIN_SPI_SS) to high

    // if the PIN_SPI_SS pin is not already configured as an output
    // then set it high (to enable the internal pull-up resistor)
    if(!(*reg & bit)){
      digitalWrite(ss_pin, HIGH);
    }

    // When the PIN_SPI_SS pin is set as OUTPUT, it can be used as
    // a general purpose output port (it doesn't influence
    // SPI operations).
    pinMode(ss_pin, OUTPUT);

    // Warning: if the SS pin ever becomes a LOW INPUT then SPI
    // automatically switches to Slave, so the data direction of
    // the SS pin MUST be kept as OUTPUT.
    SPCR |= _BV(MSTR);
    SPCR |= _BV(SPE);

    // Set direction register for SCK and MOSI pin.
    // MISO pin automatically overrides to INPUT.
    // By doing this AFTER enabling SPI, we avoid accidentally
    // clocking in a single bit since the lines go directly
    // from "input" to SPI control.
    // http://code.google.com/p/arduino/issues/detail?id=888
    pinMode(sck_pin, OUTPUT);
    pinMode(mosi_pin, OUTPUT);
    // I believe if we need to also set Master In, Slave out, We can also do it here
  }
  initialized++; // reference count
  SREG = sreg;
}
