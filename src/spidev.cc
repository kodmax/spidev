#include <stdio.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <linux/spi/spidev.h>
#include <linux/types.h>
#include <errno.h>
#include <nan.h>
#include <stdio.h>

namespace libgpiod
{
  using v8::Array;
  using v8::Context;
  using v8::Exception;
  using v8::External;
  using v8::FunctionCallbackInfo;
  using v8::Integer;
  using v8::Isolate;
  using v8::Local;
  using v8::Null;
  using v8::Number;
  using v8::Object;
  using v8::String;
  using v8::Value;

  void spi_transfer(const FunctionCallbackInfo<Value> &args)
  {
    Isolate *isolate = args.GetIsolate();

    if (args.Length() < 3 || !args[0]->IsNumber() || !args[1]->IsNumber() || !args[2]->IsUint8Array())
    {
      isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
      return;
    }

    unsigned char *data = (unsigned char *)node::Buffer::Data(args[2]);
    size_t datalen = node::Buffer::Length(args[2]);
    uint32_t size = args[1]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(0);
    uint32_t fd = args[0]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(-1);

    uint32_t bits_per_word = args[3]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(0);
    uint32_t delay_usecs = args[4]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(0);
    uint32_t cs_change = args[5]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(0);
    uint32_t speed_hz = args[6]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(0);

    spi_ioc_transfer transfer;
    memset(&transfer, 0, sizeof(transfer));

    unsigned char rx_buf[size];
    unsigned char tx_buf[size];
    memset(tx_buf, 0, sizeof(tx_buf));
    memcpy(tx_buf, data, datalen);

    transfer.tx_buf = (__u64)tx_buf;
    transfer.rx_buf = (__u64)rx_buf;
    transfer.len = size;
    transfer.speed_hz = speed_hz;
    transfer.delay_usecs = delay_usecs;
    transfer.bits_per_word = bits_per_word;
    transfer.cs_change = cs_change;

    int sent_count = ioctl(fd, SPI_IOC_MESSAGE(1), &transfer);
    if (sent_count == size)
    {
      Local<Array> ret = Array::New(isolate, size);
      for (uint32_t i = 0; i < size; i++)
      {
        ret->Set(isolate->GetCurrentContext(), i, Integer::NewFromUnsigned(isolate, rx_buf[i]));
      }

      args.GetReturnValue().Set(ret);
      return;
    }
    else
    {
      args.GetReturnValue().Set(Integer::New(isolate, errno));
      return;
    }
  }

  void spi_set_configuration(const FunctionCallbackInfo<Value> &args)
  {
    Isolate *isolate = args.GetIsolate();

    if (args.Length() != 4 || !args[0]->IsNumber() || !args[1]->IsNumber() || !args[2]->IsNumber() || !args[3]->IsNumber())
    {
      isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
      return;
    }

    uint32_t maxSpeedHz = args[3]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(0);
    uint8_t bitsPerWord = args[2]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(0);
    uint8_t mode = args[1]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(0);
    uint32_t fd = args[0]->Uint32Value(isolate->GetCurrentContext()).FromMaybe(-1);

    if (ioctl(fd, SPI_IOC_WR_BITS_PER_WORD, &bitsPerWord) == -1)
    {
      args.GetReturnValue().Set(Integer::New(isolate, errno));
      return;
    }

    if (ioctl(fd, SPI_IOC_WR_MAX_SPEED_HZ, &maxSpeedHz) == -1)
    {
      args.GetReturnValue().Set(Integer::New(isolate, errno));
      return;
    }

    if (ioctl(fd, SPI_IOC_WR_MODE, &mode) == -1)
    {
      args.GetReturnValue().Set(Integer::New(isolate, errno));
      return;
    }

    args.GetReturnValue().Set(Integer::New(isolate, 0));
  }

  void spi_get_configuration(const FunctionCallbackInfo<Value> &args)
  {
    Isolate *isolate = args.GetIsolate();

    if (args.Length() != 1 || !args[0]->IsNumber())
    {
      isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
      return;
    }

    uint32_t fd = args[0]->Int32Value(isolate->GetCurrentContext()).FromMaybe(-1);
    uint32_t maxSpeedHz;
    uint8_t bitsPerWord;
    uint8_t mode;

    if (ioctl(fd, SPI_IOC_RD_BITS_PER_WORD, &bitsPerWord) == -1)
    {
      args.GetReturnValue().Set(Integer::New(isolate, errno));
    }

    if (ioctl(fd, SPI_IOC_RD_MAX_SPEED_HZ, &maxSpeedHz) == -1)
    {
      args.GetReturnValue().Set(Integer::New(isolate, errno));
    }
    if (ioctl(fd, SPI_IOC_RD_MODE, &mode) == -1)
    {
      args.GetReturnValue().Set(Integer::New(isolate, errno));
    }

    Local<Array> ret = Array::New(isolate, 3);
    ret->Set(isolate->GetCurrentContext(), 0, Number::New(isolate, mode));
    ret->Set(isolate->GetCurrentContext(), 1, Number::New(isolate, bitsPerWord));
    ret->Set(isolate->GetCurrentContext(), 2, Number::New(isolate, maxSpeedHz));
    args.GetReturnValue().Set(ret);
  }

  void initialize(Local<Object> exports, Local<Value> module, Local<Context> ctx)
  {
    NODE_SET_METHOD(exports, "spi_get_configuration", spi_get_configuration);
    NODE_SET_METHOD(exports, "spi_set_configuration", spi_set_configuration);
    NODE_SET_METHOD(exports, "spi_transfer", spi_transfer);

    v8::Isolate *isolate = v8::Isolate::GetCurrent();
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, initialize)
} // namespace libgpiod
