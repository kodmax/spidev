{
  "targets": [
    {
      "target_name": "spidev",
      "sources": [
        "src/spidev.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('node-api-headers')\")/include",
        "<!(node -e \"require('nan')\")"
      ],
      "link_settings": {
        "libraries": [
          
        ]
      }
    }
  ]
}