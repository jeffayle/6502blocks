CFLAGS=--target=wasm32 -O2 -nostdlib -fno-builtin-memset
LDFLAGS=--target=wasm32 -nostdlib \
    -Wl,--no-entry \
    -Wl,--export=initAndResetChip \
    -Wl,--export=step \
    -Wl,--export=readNode \
    -Wl,--export=readNode8 \
	-Wl,--export=readAddressBus \
	-Wl,--export=readDataBus \
	-Wl,--export=writeDataBus
CC=clang

6502.wasm: netlist_sim.o perfect6502.o libc.o
	$(CC) $(LDFLAGS) -o 6502.wasm $^
