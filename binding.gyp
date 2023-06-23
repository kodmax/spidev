{
  "targets": [
    {
      "target_name": "spidev",
      "include_dirs": [
        "<!(node -e \"require('node-api-headers')\")/include",
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}