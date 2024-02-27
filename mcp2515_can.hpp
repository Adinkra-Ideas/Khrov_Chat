#ifndef MCP2515_CAN_
#define MCP2515_CAN_

#include "SpiClass.hpp"
class SpiClass;

#define SPDR _SFR_IO8(0x2E)
#define SPSR _SFR_IO8(0x2D)
#define SPIF 7

// speed 16M

#define MCP_16MHz_1000kBPS_CFG1 (0x00)
#define MCP_16MHz_1000kBPS_CFG2 (0xD0)
#define MCP_16MHz_1000kBPS_CFG3 (0x82)

#define MCP_16MHz_800kBPS_CFG1 (0x40)
#define MCP_16MHz_800kBPS_CFG2 (0x92)
#define MCP_16MHz_800kBPS_CFG3 (0x02)

#define MCP_16MHz_666kBPS_CFG1 (0x00)
#define MCP_16MHz_666kBPS_CFG2 (0xA0)
#define MCP_16MHz_666kBPS_CFG3 (0x04)

#define MCP_16MHz_500kBPS_CFG1 (0x00)
#define MCP_16MHz_500kBPS_CFG2 (0xF0)
#define MCP_16MHz_500kBPS_CFG3 (0x86)

#define MCP_16MHz_250kBPS_CFG1 (0x41)
#define MCP_16MHz_250kBPS_CFG2 (0xF1)
#define MCP_16MHz_250kBPS_CFG3 (0x85)

#define MCP_16MHz_200kBPS_CFG1 (0x01)
#define MCP_16MHz_200kBPS_CFG2 (0xFA)
#define MCP_16MHz_200kBPS_CFG3 (0x87)

#define MCP_16MHz_125kBPS_CFG1 (0x03)
#define MCP_16MHz_125kBPS_CFG2 (0xF0)
#define MCP_16MHz_125kBPS_CFG3 (0x86)

#define MCP_16MHz_100kBPS_CFG1 (0x03)
#define MCP_16MHz_100kBPS_CFG2 (0xFA)
#define MCP_16MHz_100kBPS_CFG3 (0x87)

#define MCP_16MHz_95kBPS_CFG1 (0x03)
#define MCP_16MHz_95kBPS_CFG2 (0xAD)
#define MCP_16MHz_95kBPS_CFG3 (0x07)

#define MCP_16MHz_83k3BPS_CFG1 (0x03)
#define MCP_16MHz_83k3BPS_CFG2 (0xBE)
#define MCP_16MHz_83k3BPS_CFG3 (0x07)

#define MCP_16MHz_80kBPS_CFG1 (0x03)
#define MCP_16MHz_80kBPS_CFG2 (0xFF)
#define MCP_16MHz_80kBPS_CFG3 (0x87)

#define MCP_16MHz_50kBPS_CFG1 (0x07)
#define MCP_16MHz_50kBPS_CFG2 (0xFA)
#define MCP_16MHz_50kBPS_CFG3 (0x87)

#define MCP_16MHz_40kBPS_CFG1 (0x07)
#define MCP_16MHz_40kBPS_CFG2 (0xFF)
#define MCP_16MHz_40kBPS_CFG3 (0x87)

#define MCP_16MHz_33kBPS_CFG1 (0x09)
#define MCP_16MHz_33kBPS_CFG2 (0xBE)
#define MCP_16MHz_33kBPS_CFG3 (0x07)

#define MCP_16MHz_31k25BPS_CFG1 (0x0F)
#define MCP_16MHz_31k25BPS_CFG2 (0xF1)
#define MCP_16MHz_31k25BPS_CFG3 (0x85)

#define MCP_16MHz_25kBPS_CFG1 (0X0F)
#define MCP_16MHz_25kBPS_CFG2 (0XBA)
#define MCP_16MHz_25kBPS_CFG3 (0X07)

#define MCP_16MHz_20kBPS_CFG1 (0x0F)
#define MCP_16MHz_20kBPS_CFG2 (0xFF)
#define MCP_16MHz_20kBPS_CFG3 (0x87)

#define MCP_16MHz_10kBPS_CFG1 (0x1F)
#define MCP_16MHz_10kBPS_CFG2 (0xFF)
#define MCP_16MHz_10kBPS_CFG3 (0x87)

#define MCP_16MHz_5kBPS_CFG1 (0x3F)
#define MCP_16MHz_5kBPS_CFG2 (0xFF)
#define MCP_16MHz_5kBPS_CFG3 (0x87)


// speed 12M

#define MCP_12MHz_1000kBPS_CFG1 (0x00)//
#define MCP_12MHz_1000kBPS_CFG2 (0x88)//
#define MCP_12MHz_1000kBPS_CFG3 (0x01)//

#define MCP_12MHz_666kBPS_CFG1 (0x00)//
#define MCP_12MHz_666kBPS_CFG2 (0x92)//
#define MCP_12MHz_666kBPS_CFG3 (0x01)//

#define MCP_12MHz_500kBPS_CFG1 (0x00)
#define MCP_12MHz_500kBPS_CFG2 (0x9B)
#define MCP_12MHz_500kBPS_CFG3 (0x02)

#define MCP_12MHz_250kBPS_CFG1 (0x00)//
#define MCP_12MHz_250kBPS_CFG2 (0xBF)//
#define MCP_12MHz_250kBPS_CFG3 (0x06)///

#define MCP_12MHz_200kBPS_CFG1 (0x01)//
#define MCP_12MHz_200kBPS_CFG2 (0xA4)//
#define MCP_12MHz_200kBPS_CFG3 (0x03)//

#define MCP_12MHz_125kBPS_CFG1 (0x01)//
#define MCP_12MHz_125kBPS_CFG2 (0xBF)//
#define MCP_12MHz_125kBPS_CFG3 (0x06)//

#define MCP_12MHz_100kBPS_CFG1 (0x02)//
#define MCP_12MHz_100kBPS_CFG2 (0xB6)//
#define MCP_12MHz_100kBPS_CFG3 (0x04)//

#define MCP_12MHz_95kBPS_CFG1 (0x02)//
#define MCP_12MHz_95kBPS_CFG2 (0xBE)//
#define MCP_12MHz_95kBPS_CFG3 (0x04)//

#define MCP_12MHz_83k3BPS_CFG1 (0x03)//
#define MCP_12MHz_83k3BPS_CFG2 (0xB5)//
#define MCP_12MHz_83k3BPS_CFG3 (0x03)//

#define MCP_12MHz_80kBPS_CFG1 (0x04)//
#define MCP_12MHz_80kBPS_CFG2 (0xA4)//
#define MCP_12MHz_80kBPS_CFG3 (0x03)//

#define MCP_12MHz_50kBPS_CFG1 (0x05)//
#define MCP_12MHz_50kBPS_CFG2 (0xB6)//
#define MCP_12MHz_50kBPS_CFG3 (0x04)//

#define MCP_12MHz_40kBPS_CFG1 (0x09)//
#define MCP_12MHz_40kBPS_CFG2 (0xA4)//
#define MCP_12MHz_40kBPS_CFG3 (0x03)//

#define MCP_12MHz_33kBPS_CFG1 (0x0C)//
#define MCP_12MHz_33kBPS_CFG2 (0xA4)//
#define MCP_12MHz_33kBPS_CFG3 (0x02)//

#define MCP_12MHz_31k25BPS_CFG1 (0x0B)//
#define MCP_12MHz_31k25BPS_CFG2 (0xAC)//
#define MCP_12MHz_31k25BPS_CFG3 (0x03)//

#define MCP_12MHz_25kBPS_CFG1 (0X0B)//
#define MCP_12MHz_25kBPS_CFG2 (0XB6)//
#define MCP_12MHz_25kBPS_CFG3 (0X04)//

#define MCP_12MHz_20kBPS_CFG1 (0x0C)//
#define MCP_12MHz_20kBPS_CFG2 (0xBF)//
#define MCP_12MHz_20kBPS_CFG3 (0x05)//



// speed 8M

#define MCP_8MHz_1000kBPS_CFG1 (0x00)
#define MCP_8MHz_1000kBPS_CFG2 (0x80)
#define MCP_8MHz_1000kBPS_CFG3 (0x00)

#define MCP_8MHz_800kBPS_CFG1 (0x00)
#define MCP_8MHz_800kBPS_CFG2 (0x80)
#define MCP_8MHz_800kBPS_CFG3 (0x01)

#define MCP_8MHz_500kBPS_CFG1 (0x00)
#define MCP_8MHz_500kBPS_CFG2 (0x90)
#define MCP_8MHz_500kBPS_CFG3 (0x02)

#define MCP_8MHz_250kBPS_CFG1 (0x00)
#define MCP_8MHz_250kBPS_CFG2 (0xb1)
#define MCP_8MHz_250kBPS_CFG3 (0x05)

#define MCP_8MHz_200kBPS_CFG1 (0x00)
#define MCP_8MHz_200kBPS_CFG2 (0xb4)
#define MCP_8MHz_200kBPS_CFG3 (0x06)

#define MCP_8MHz_125kBPS_CFG1 (0x01)
#define MCP_8MHz_125kBPS_CFG2 (0xb1)
#define MCP_8MHz_125kBPS_CFG3 (0x05)

#define MCP_8MHz_100kBPS_CFG1 (0x01)
#define MCP_8MHz_100kBPS_CFG2 (0xb4)
#define MCP_8MHz_100kBPS_CFG3 (0x06)

#define MCP_8MHz_95k2BPS_CFG1 (0x01)
#define MCP_8MHz_95k2BPS_CFG2 (0xBB)
#define MCP_8MHz_95k2BPS_CFG3 (0x07)

#define MCP_8MHz_80kBPS_CFG1 (0x01)
#define MCP_8MHz_80kBPS_CFG2 (0xbf)
#define MCP_8MHz_80kBPS_CFG3 (0x07)

#define MCP_8MHz_50kBPS_CFG1 (0x03)
#define MCP_8MHz_50kBPS_CFG2 (0xb4)
#define MCP_8MHz_50kBPS_CFG3 (0x06)

#define MCP_8MHz_40kBPS_CFG1 (0x03)
#define MCP_8MHz_40kBPS_CFG2 (0xbf)
#define MCP_8MHz_40kBPS_CFG3 (0x07)

#define MCP_8MHz_31k25BPS_CFG1 (0x07)
#define MCP_8MHz_31k25BPS_CFG2 (0xa4)
#define MCP_8MHz_31k25BPS_CFG3 (0x04)

#define MCP_8MHz_20kBPS_CFG1 (0x07)
#define MCP_8MHz_20kBPS_CFG2 (0xbf)
#define MCP_8MHz_20kBPS_CFG3 (0x07)

#define MCP_8MHz_10kBPS_CFG1 (0x0f)
#define MCP_8MHz_10kBPS_CFG2 (0xbf)
#define MCP_8MHz_10kBPS_CFG3 (0x07)

#define MCP_8MHz_5kBPS_CFG1 (0x1f)
#define MCP_8MHz_5kBPS_CFG2 (0xbf)
#define MCP_8MHz_5kBPS_CFG3 (0x07)


// clock
typedef enum {
    MCP_NO_MHz,
    /* apply to MCP2515 */
    MCP_16MHz,
    MCP_12MHz,
    MCP_8MHz,
    /* apply to MCP2518FD */
    MCP2518FD_40MHz = MCP_16MHz /* To compatible MCP2515 shield */,
    MCP2518FD_20MHz,
    MCP2518FD_10MHz,
} MCP_CLOCK_T;

typedef enum {
    CAN_NOBPS,
    CAN_5KBPS,
    CAN_10KBPS,
    CAN_20KBPS,
    CAN_25KBPS,
    CAN_31K25BPS,
    CAN_33KBPS  ,
    CAN_40KBPS  ,
    CAN_50KBPS  ,
    CAN_80KBPS  ,
    CAN_83K3BPS ,
    CAN_95KBPS  ,
    CAN_95K2BPS ,
    CAN_100KBPS ,
    CAN_125KBPS ,
    CAN_200KBPS ,
    CAN_250KBPS ,
    CAN_500KBPS ,
    CAN_666KBPS ,
    CAN_800KBPS ,
    CAN_1000KBPS
} MCP_BITTIME_SETUP;

class mcp2515_can {
public:
  mcp2515_can(uint8_t SPICS);
 
  /************* Setters ***************/
  void  setSPI(SpiClass *_pSPI);  // define SPI port to use before begin() (I BELIEVE HERE IS WHERE WE SET THE OTHER 3 PINOUTS)
  // well the SpiClass doesn't even have a constructor defined. Which means, upon instantiation, just an empty object is received

  /*************************************/ 
    
  /************  methods  **************/   
  void init_CS(uint8_t SPICS); 

  uint8_t begin(uint32_t speedset,
                  const uint8_t mosi_pin,
                  const uint8_t miso_pin,
                  const uint8_t sck_pin,
                  const uint8_t clockset = MCP_16MHz);

  byte mcp2515_init(const byte canSpeed, const byte clock);

  inline static uint8_t transfer(uint8_t data);
  void mcp2515_setRegister(const byte address, const byte value);
  void mcp2515_modifyRegister(const byte address, const byte mask, const byte data);
  byte mcp2515_readRegister(const byte address);
  byte mcp2515_requestNewMode(const byte newmode);
  void mcp2515_reset(void);
  byte mcp2515_configRate(const byte canSpeed, const byte clock);
  byte mcp2515_setCANCTRL_Mode(const byte newmode);
  void mcp2515_initCANBuffers(void);
  byte setMode(const byte opMode);

  /*************************************/


private:
  SpiClass *pSPI;   // this SPI rvalue is an instance of SPIClass instantiated from its definition file at <SPI.h>
  uint8_t   SPICS;
  byte mcpMode;
};


#endif
