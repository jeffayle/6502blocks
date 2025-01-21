CFLAGS=--target=wasm32 -g -nostdlib
LDFLAGS=--target=wasm32 -Wl,--no-entry -Wl,--export=initAndResetChip -Wl,--export=step -Wl,--export=readAddressBus -Wl,--export=readPCL -Wl,--export=readIR -nostdlib
CC=clang

6502.wasm: apple1basic.o netlist_sim.o perfect6502.o libc.o
	$(CC) $(LDFLAGS) -o 6502.wasm $^
