CFLAGS=--target=wasm32 -g -nostdlib
LDFLAGS=--target=wasm32 -nostdlib \
    -Wl,--no-entry \
    -Wl,--export=initAndResetChip \
    -Wl,--export=step \
    -Wl,--export=readNode \
    -Wl,--export=readNode8
CC=clang

6502.wasm: apple1basic.o netlist_sim.o perfect6502.o libc.o
	$(CC) $(LDFLAGS) -o 6502.wasm $^
