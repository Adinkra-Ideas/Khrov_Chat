#include "mcp2515_can.hpp"

// ********************
// CANONICALS BEGINS  *
// ********************
mcp2515_can::mcp2515_can(uint8_t SPICS) {
  pSPI = &SPI;      // assigning the address of an already instantiated SPIClass object from <SPI.h> to *pSPI
  init_CS(SPICS);   // Uses pinMode() to set the SPICS pinout to OUTPUT and then use digitalWrite() to write a HIGH into the pinout
}
// ******************
// CANONICALS ENDS  *
// ******************


// ******************
//  SETTERS BEGINS  *
// ******************
void mcp2515_can::setSPI(SpiClass *SPI_param) {
  pSPI = SPI_param;
}


// ******************
//  SETTERS BEGINS  *
// ******************
void  mcp2515_can::init_CS(uint8_t CS) {
  SPICS = CS;

  pinMode(SPICS, OUTPUT);       // set the user-provided pin to OUTPUT mode
  digitalWrite(SPICS, HIGH);    // write a value of HIGH AKA 1 AKA 5V into the pin to begin with
  // if the SPICS pin is not already configured as an output
  // then set it high (to enable the internal pull-up resistor)
}
// ******************
//  SETTERS ENDS    *
// ******************


/*********************************************************************************************************
** Function name:           begin
** Descriptions:            init can and set speed
*********************************************************************************************************/
uint8_t mcp2515_can::begin(uint32_t speedset,
                            const uint8_t mosi_pin,
                            const uint8_t miso_pin,
                            const uint8_t sck_pin,
                            const byte clockset) {
  pSPI->begin(SPICS, mosi_pin, miso_pin, sck_pin) ; // everything here is just calling Arduino system

  byte res = mcp2515_init((byte)speedset, clockset) ; // continue from here

  return ((res == 0) ? 0 : 1) ; // 0 is MCP2515_OK, 0 is CAN_OK, 1 is CAN_FAILINIT
}





/*********************************************************************************************************
** Function name:           mcp2515_configRate
** Descriptions:            set baudrate
*********************************************************************************************************/
byte mcp2515_can::mcp2515_configRate(const byte canSpeed, const byte clock) {
  byte set, cfg1, cfg2, cfg3;
  set = 1;
  switch (clock) {
      case (MCP_16MHz) :
          switch (canSpeed) {
                case (CAN_5KBPS):
                    cfg1 = MCP_16MHz_5kBPS_CFG1;
                    cfg2 = MCP_16MHz_5kBPS_CFG2;
                    cfg3 = MCP_16MHz_5kBPS_CFG3;
                    break;

                case (CAN_10KBPS):
                    cfg1 = MCP_16MHz_10kBPS_CFG1;
                    cfg2 = MCP_16MHz_10kBPS_CFG2;
                    cfg3 = MCP_16MHz_10kBPS_CFG3;
                    break;

                case (CAN_20KBPS):
                    cfg1 = MCP_16MHz_20kBPS_CFG1;
                    cfg2 = MCP_16MHz_20kBPS_CFG2;
                    cfg3 = MCP_16MHz_20kBPS_CFG3;
                    break;

                case (CAN_25KBPS):
                    cfg1 = MCP_16MHz_25kBPS_CFG1;
                    cfg2 = MCP_16MHz_25kBPS_CFG2;
                    cfg3 = MCP_16MHz_25kBPS_CFG3;
                    break;

                case (CAN_31K25BPS):
                    cfg1 = MCP_16MHz_31k25BPS_CFG1;
                    cfg2 = MCP_16MHz_31k25BPS_CFG2;
                    cfg3 = MCP_16MHz_31k25BPS_CFG3;
                    break;

                case (CAN_33KBPS):
                    cfg1 = MCP_16MHz_33kBPS_CFG1;
                    cfg2 = MCP_16MHz_33kBPS_CFG2;
                    cfg3 = MCP_16MHz_33kBPS_CFG3;
                    break;

                case (CAN_40KBPS):
                    cfg1 = MCP_16MHz_40kBPS_CFG1;
                    cfg2 = MCP_16MHz_40kBPS_CFG2;
                    cfg3 = MCP_16MHz_40kBPS_CFG3;
                    break;

                case (CAN_50KBPS):
                    cfg1 = MCP_16MHz_50kBPS_CFG1;
                    cfg2 = MCP_16MHz_50kBPS_CFG2;
                    cfg3 = MCP_16MHz_50kBPS_CFG3;
                    break;

                case (CAN_80KBPS):
                    cfg1 = MCP_16MHz_80kBPS_CFG1;
                    cfg2 = MCP_16MHz_80kBPS_CFG2;
                    cfg3 = MCP_16MHz_80kBPS_CFG3;
                    break;

                case (CAN_83K3BPS):
                    cfg1 = MCP_16MHz_83k3BPS_CFG1;
                    cfg2 = MCP_16MHz_83k3BPS_CFG2;
                    cfg3 = MCP_16MHz_83k3BPS_CFG3;
                    break;

                case (CAN_95KBPS):
                    cfg1 = MCP_16MHz_95kBPS_CFG1;
                    cfg2 = MCP_16MHz_95kBPS_CFG2;
                    cfg3 = MCP_16MHz_95kBPS_CFG3;
                    break;

                case (CAN_100KBPS):
                    cfg1 = MCP_16MHz_100kBPS_CFG1;
                    cfg2 = MCP_16MHz_100kBPS_CFG2;
                    cfg3 = MCP_16MHz_100kBPS_CFG3;
                    break;

                case (CAN_125KBPS):
                    cfg1 = MCP_16MHz_125kBPS_CFG1;
                    cfg2 = MCP_16MHz_125kBPS_CFG2;
                    cfg3 = MCP_16MHz_125kBPS_CFG3;
                    break;

                case (CAN_200KBPS):
                    cfg1 = MCP_16MHz_200kBPS_CFG1;
                    cfg2 = MCP_16MHz_200kBPS_CFG2;
                    cfg3 = MCP_16MHz_200kBPS_CFG3;
                    break;

                case (CAN_250KBPS):
                    cfg1 = MCP_16MHz_250kBPS_CFG1;
                    cfg2 = MCP_16MHz_250kBPS_CFG2;
                    cfg3 = MCP_16MHz_250kBPS_CFG3;
                    break;

                case (CAN_500KBPS):
                    cfg1 = MCP_16MHz_500kBPS_CFG1;
                    cfg2 = MCP_16MHz_500kBPS_CFG2;
                    cfg3 = MCP_16MHz_500kBPS_CFG3;
                    break;

                case (CAN_666KBPS):
                    cfg1 = MCP_16MHz_666kBPS_CFG1;
                    cfg2 = MCP_16MHz_666kBPS_CFG2;
                    cfg3 = MCP_16MHz_666kBPS_CFG3;
                    break;

                case (CAN_800KBPS) :
                    cfg1 = MCP_16MHz_800kBPS_CFG1;
                    cfg2 = MCP_16MHz_800kBPS_CFG2;
                    cfg3 = MCP_16MHz_800kBPS_CFG3;
                    break;

                case (CAN_1000KBPS):
                    cfg1 = MCP_16MHz_1000kBPS_CFG1;
                    cfg2 = MCP_16MHz_1000kBPS_CFG2;
                    cfg3 = MCP_16MHz_1000kBPS_CFG3;
                    break;

                default:
                    set = 0;
                    break;
            }
            break;

        case (MCP_12MHz) :
            switch (canSpeed) {
                case (CAN_20KBPS) :
                    cfg1 = MCP_12MHz_20kBPS_CFG1;
                    cfg2 = MCP_12MHz_20kBPS_CFG2;
                    cfg3 = MCP_12MHz_20kBPS_CFG3;
                    break;

                case (CAN_25KBPS) :
                    cfg1 = MCP_12MHz_25kBPS_CFG1;
                    cfg2 = MCP_12MHz_25kBPS_CFG2;
                    cfg3 = MCP_12MHz_25kBPS_CFG3;
                    break;

                case (CAN_31K25BPS) :
                    cfg1 = MCP_12MHz_31k25BPS_CFG1;
                    cfg2 = MCP_12MHz_31k25BPS_CFG2;
                    cfg3 = MCP_12MHz_31k25BPS_CFG3;
                    break;

                case (CAN_33KBPS) :
                    cfg1 = MCP_12MHz_33kBPS_CFG1;
                    cfg2 = MCP_12MHz_33kBPS_CFG2;
                    cfg3 = MCP_12MHz_33kBPS_CFG3;
                    break;

                case (CAN_40KBPS) :
                    cfg1 = MCP_12MHz_40kBPS_CFG1;
                    cfg2 = MCP_12MHz_40kBPS_CFG2;
                    cfg3 = MCP_12MHz_40kBPS_CFG3;
                    break;

                case (CAN_50KBPS) :
                    cfg1 = MCP_12MHz_50kBPS_CFG1;
                    cfg2 = MCP_12MHz_50kBPS_CFG2;
                    cfg3 = MCP_12MHz_50kBPS_CFG3;
                    break;

                case (CAN_80KBPS) :
                    cfg1 = MCP_12MHz_80kBPS_CFG1;
                    cfg2 = MCP_12MHz_80kBPS_CFG2;
                    cfg3 = MCP_12MHz_80kBPS_CFG3;
                    break;

                case (CAN_83K3BPS) :
                    cfg1 = MCP_12MHz_83k3BPS_CFG1;
                    cfg2 = MCP_12MHz_83k3BPS_CFG2;
                    cfg3 = MCP_12MHz_83k3BPS_CFG3;
                    break;

                case (CAN_95KBPS) :
                    cfg1 = MCP_12MHz_95kBPS_CFG1;
                    cfg2 = MCP_12MHz_95kBPS_CFG2;
                    cfg3 = MCP_12MHz_95kBPS_CFG3;
                    break;

                case (CAN_100KBPS) :
                    cfg1 = MCP_12MHz_100kBPS_CFG1;
                    cfg2 = MCP_12MHz_100kBPS_CFG2;
                    cfg3 = MCP_12MHz_100kBPS_CFG3;
                    break;

                case (CAN_125KBPS) :
                    cfg1 = MCP_12MHz_125kBPS_CFG1;
                    cfg2 = MCP_12MHz_125kBPS_CFG2;
                    cfg3 = MCP_12MHz_125kBPS_CFG3;
                    break;

                case (CAN_200KBPS) :
                    cfg1 = MCP_12MHz_200kBPS_CFG1;
                    cfg2 = MCP_12MHz_200kBPS_CFG2;
                    cfg3 = MCP_12MHz_200kBPS_CFG3;
                    break;

                case (CAN_250KBPS) :
                    cfg1 = MCP_12MHz_250kBPS_CFG1;
                    cfg2 = MCP_12MHz_250kBPS_CFG2;
                    cfg3 = MCP_12MHz_250kBPS_CFG3;
                    break;

                case (CAN_500KBPS) :
                    cfg1 = MCP_12MHz_500kBPS_CFG1;
                    cfg2 = MCP_12MHz_500kBPS_CFG2;
                    cfg3 = MCP_12MHz_500kBPS_CFG3;
                    break;

                case (CAN_666KBPS) :
                    cfg1 = MCP_12MHz_666kBPS_CFG1;
                    cfg2 = MCP_12MHz_666kBPS_CFG2;
                    cfg3 = MCP_12MHz_666kBPS_CFG3;
                    break;

                case (CAN_1000KBPS) :
                    cfg1 = MCP_12MHz_1000kBPS_CFG1;
                    cfg2 = MCP_12MHz_1000kBPS_CFG2;
                    cfg3 = MCP_12MHz_1000kBPS_CFG3;
                    break;

                default:
                    set = 0;
                    break;
            }
            break;
        case (MCP_8MHz) :
            switch (canSpeed) {
                case (CAN_5KBPS) :
                    cfg1 = MCP_8MHz_5kBPS_CFG1;
                    cfg2 = MCP_8MHz_5kBPS_CFG2;
                    cfg3 = MCP_8MHz_5kBPS_CFG3;
                    break;

                case (CAN_10KBPS) :
                    cfg1 = MCP_8MHz_10kBPS_CFG1;
                    cfg2 = MCP_8MHz_10kBPS_CFG2;
                    cfg3 = MCP_8MHz_10kBPS_CFG3;
                    break;

                case (CAN_20KBPS) :
                    cfg1 = MCP_8MHz_20kBPS_CFG1;
                    cfg2 = MCP_8MHz_20kBPS_CFG2;
                    cfg3 = MCP_8MHz_20kBPS_CFG3;
                    break;

                case (CAN_31K25BPS) :
                    cfg1 = MCP_8MHz_31k25BPS_CFG1;
                    cfg2 = MCP_8MHz_31k25BPS_CFG2;
                    cfg3 = MCP_8MHz_31k25BPS_CFG3;
                    break;

                case (CAN_40KBPS) :
                    cfg1 = MCP_8MHz_40kBPS_CFG1;
                    cfg2 = MCP_8MHz_40kBPS_CFG2;
                    cfg3 = MCP_8MHz_40kBPS_CFG3;
                    break;

                case (CAN_50KBPS) :
                    cfg1 = MCP_8MHz_50kBPS_CFG1;
                    cfg2 = MCP_8MHz_50kBPS_CFG2;
                    cfg3 = MCP_8MHz_50kBPS_CFG3;
                    break;

                case (CAN_80KBPS) :
                    cfg1 = MCP_8MHz_80kBPS_CFG1;
                    cfg2 = MCP_8MHz_80kBPS_CFG2;
                    cfg3 = MCP_8MHz_80kBPS_CFG3;
                    break;

				case (CAN_95K2BPS):
                    cfg1 = MCP_8MHz_95k2BPS_CFG1;
                    cfg2 = MCP_8MHz_95k2BPS_CFG2;
                    cfg3 = MCP_8MHz_95k2BPS_CFG3;
                    break;
                    
                case (CAN_100KBPS) :
                    cfg1 = MCP_8MHz_100kBPS_CFG1;
                    cfg2 = MCP_8MHz_100kBPS_CFG2;
                    cfg3 = MCP_8MHz_100kBPS_CFG3;
                    break;

                case (CAN_125KBPS) :
                    cfg1 = MCP_8MHz_125kBPS_CFG1;
                    cfg2 = MCP_8MHz_125kBPS_CFG2;
                    cfg3 = MCP_8MHz_125kBPS_CFG3;
                    break;

                case (CAN_200KBPS) :
                    cfg1 = MCP_8MHz_200kBPS_CFG1;
                    cfg2 = MCP_8MHz_200kBPS_CFG2;
                    cfg3 = MCP_8MHz_200kBPS_CFG3;
                    break;

                case (CAN_250KBPS) :
                    cfg1 = MCP_8MHz_250kBPS_CFG1;
                    cfg2 = MCP_8MHz_250kBPS_CFG2;
                    cfg3 = MCP_8MHz_250kBPS_CFG3;
                    break;

                case (CAN_500KBPS) :
                    cfg1 = MCP_8MHz_500kBPS_CFG1;
                    cfg2 = MCP_8MHz_500kBPS_CFG2;
                    cfg3 = MCP_8MHz_500kBPS_CFG3;
                    break;

                case (CAN_800KBPS) :
                    cfg1 = MCP_8MHz_800kBPS_CFG1;
                    cfg2 = MCP_8MHz_800kBPS_CFG2;
                    cfg3 = MCP_8MHz_800kBPS_CFG3;
                    break;

                case (CAN_1000KBPS) :
                    cfg1 = MCP_8MHz_1000kBPS_CFG1;
                    cfg2 = MCP_8MHz_1000kBPS_CFG2;
                    cfg3 = MCP_8MHz_1000kBPS_CFG3;
                    break;

                default:
                    set = 0;
                    break;
            }
            break;

        default:
            set = 0;
            break;
    }

    if (set) {
        mcp2515_setRegister(0X2A, cfg1); // MCP_CNF1
        mcp2515_setRegister(0x29, cfg2); // MCP_CNF2
        mcp2515_setRegister(0x28, cfg3); // MCP_CNF3
        return 0; // MCP2515_OK
    } else {
        return 1; // MCP2515_FAIL
    }
}

byte mcp2515_can::mcp2515_init(const byte canSpeed, const byte clock) {
  byte res;

  mcp2515_reset();

  res = mcp2515_setCANCTRL_Mode(0x80); // MODE_CONFIG == 0x80 or 128 in Dec. Which means 1byte or 8bits
  if (res > 0) {
    SERIAL_PORT_MONITOR.println(F("Enter setting mode fail"));
    delay(10);
    return res;
  } 

  delay(10);

  // set boadrate
  if (mcp2515_configRate(canSpeed, clock)) {
    delay(10);
    return res;
  } 
  // we stopped after studying mcp2515_configRate but we will
  if (res == 0) {
    // init canbuffers
    mcp2515_initCANBuffers();

    // interrupt mode
    mcp2515_setRegister(0X2B, 0X01 | 0X02); // MCP_CANINTE, MCP_RX0IF | MCP_RX1IF

    // In this part below, we will try to print from both the if and else to see which block gets called, if none gets called, we will print whats in DEBUG_RXANY
    // #if (DEBUG_RXANY==1)
    // // enable both receive-buffers to receive any message and enable rollover
    // mcp2515_modifyRegister(MCP_RXB0CTRL,
    //                         MCP_RXB_RX_MASK | MCP_RXB_BUKT_MASK,
    //                         MCP_RXB_RX_ANY | MCP_RXB_BUKT_MASK);
    // mcp2515_modifyRegister(MCP_RXB1CTRL, MCP_RXB_RX_MASK,
    //                         MCP_RXB_RX_ANY);
    // #else
    // // enable both receive-buffers to receive messages with std. and ext. identifiers and enable rollover
    // mcp2515_modifyRegister(MCP_RXB0CTRL,
    //                         MCP_RXB_RX_MASK | MCP_RXB_BUKT_MASK,
    //                         MCP_RXB_RX_STDEXT | MCP_RXB_BUKT_MASK);
    // mcp2515_modifyRegister(MCP_RXB1CTRL, MCP_RXB_RX_MASK,
    //                         MCP_RXB_RX_STDEXT);
    // #endif

    res = setMode(0X00); // MODE_NORMAL
    if (res) {
      delay(10);
      return res;
    }

    delay(10);
  }

  return res;
}

/*********************************************************************************************************
** Function name:           setMode
** Descriptions:            Sets control mode
*********************************************************************************************************/
byte mcp2515_can::setMode(const byte opMode) {
    if (opMode !=
            0X20) { // 0X20 is MODE_SLEEP. if going to sleep, the value stored in opMode is not changed so that we can return to it later
        mcpMode = opMode;
    }
    return mcp2515_setCANCTRL_Mode(opMode);
}

/*********************************************************************************************************
** Function name:           mcp2515_initCANBuffers
** Descriptions:            init canbuffers
*********************************************************************************************************/
void mcp2515_can::mcp2515_initCANBuffers(void) {
    byte i, a1, a2, a3;

    a1 = 0X30; // MCP_TXB0CTRL
    a2 = 0X40; // MCP_TXB1CTRL
    a3 = 0X50; // MCP_TXB2CTRL
    for (i = 0; i < 14; i++) {                       // in-buffer loop
        mcp2515_setRegister(a1, 0);
        mcp2515_setRegister(a2, 0);
        mcp2515_setRegister(a3, 0);
        a1++;
        a2++;
        a3++;
    }
    mcp2515_setRegister(0X60, 0); // MCP_RXB0CTRL
    mcp2515_setRegister(0X70, 0); // MCP_RXB1CTRL
}

uint8_t mcp2515_can::transfer(uint8_t data) {
  SPDR = data;
  /*
    * The following NOP introduces a small delay that can prevent the wait
    * loop form iterating when running at the maximum speed. This gives
    * about 10% more speed, even if it seems counter-intuitive. At lower
    * speeds it is unnoticed.
    */
  asm volatile("nop");
  while (!(SPSR & _BV(SPIF))); // wait
  return SPDR;
}

/*********************************************************************************************************
** Function name:           mcp2515_setRegister
** Descriptions:            set register
*********************************************************************************************************/
void mcp2515_can::mcp2515_setRegister(const byte address, const byte value) {
  digitalWrite(SS, LOW);

  transfer(0X02); // MCP_WRITE
  transfer(address);
  transfer(value);
  
  digitalWrite(SS, HIGH);
}

void mcp2515_can::mcp2515_modifyRegister(const byte address, const byte mask, const byte data) {
  digitalWrite(SS, LOW);

  transfer(0X05);
  transfer(address);
  transfer(mask);
  transfer(data);
  
  digitalWrite(SS, HIGH);
}

byte mcp2515_can::mcp2515_readRegister(const byte address) {
  byte ret;

  digitalWrite(SS, LOW);

  transfer(0X03); // 0X03 MCP_READ
  transfer(address);
  ret = transfer(0x00);

  digitalWrite(SS, HIGH);

  return ret;
}

byte mcp2515_can::mcp2515_requestNewMode(const byte newmode) {
  unsigned long startTime = millis();

  // Spam new mode request and wait for the operation  to complete
  while (1) {
    // Request new mode
    // This is inside the loop as sometimes requesting the new mode once doesn't work (usually when attempting to sleep)
    mcp2515_modifyRegister(0X0F, 0XE0, newmode);  // 0XE0 is MODE_MASK

    byte statReg = mcp2515_readRegister(0X0E); // 0X0E is MCP_CANSTAT

    if ((statReg & 0XE0) == newmode) { // We're now in the new mode
      return 0; // MCP2515_OK
    } else if ((millis() - startTime) > 200) { // Wait no more than 200ms for the operation to complete
      return 1; // MCP2515_FAIL
    }

  }
}

void mcp2515_can::mcp2515_reset(void) {
  noInterrupts(); // to free any existing interrupts
  digitalWrite(SS, LOW); // to set SS to LOW so as to release it.
  digitalWrite(SS, HIGH); // again to set SS back to high so as to reacquire it
  delay(10); // to kind of slow things down
}

//
byte mcp2515_can::mcp2515_setCANCTRL_Mode(const byte newmode) {
  mcp2515_modifyRegister(0X2C, 0X40, 0);
  return mcp2515_requestNewMode(newmode);
}


/*********************************************************************************************************
** Function name:           sendMsg
** Descriptions:            send message
*********************************************************************************************************/
byte mcp2515_can::sendMsg(unsigned long id, byte ext, byte rtrBit, byte len, const byte* buf, bool wait_sent) {
    byte res, res1, txbuf_n;
    uint16_t uiTimeOut = 0;

    can_id = id;
    ext_flg = ext;
    rtr = rtrBit;

    do {
        if (uiTimeOut > 0) {
            delayMicroseconds(10);
        }
        res = mcp2515_getNextFreeTXBuf(&txbuf_n);                       // info = addr.
        uiTimeOut++;
    } while (res == MCP_ALLTXBUSY && (uiTimeOut < TIMEOUTVALUE));

    if (uiTimeOut == TIMEOUTVALUE) {
        return CAN_GETTXBFTIMEOUT;                                      // get tx buff time out
    }
    mcp2515_write_canMsg(txbuf_n, id, ext, rtrBit, len, buf);

    if (wait_sent) {
        uiTimeOut = 0;
        do {
            if (uiTimeOut > 0) {
                delayMicroseconds(10);
            }
            uiTimeOut++;
            res1 = mcp2515_readRegister(txbuf_n - 1);  // read send buff ctrl reg
            res1 = res1 & 0x08;
        } while (res1 && (uiTimeOut < TIMEOUTVALUE));

        if (uiTimeOut == TIMEOUTVALUE) {                                     // send msg timeout
            return CAN_SENDMSGTIMEOUT;
        }
    }

    return CAN_OK;

} // sending msg got us here stoppped