#include "perfect6502.h"
 
/************************************************************
 *
 * Interface to OS Library Code / Monitor
 *
 ************************************************************/

/* imported by runtime.c */
unsigned char A, X, Y, S, P;
unsigned short PC;
int N, Z, C;

void
init_monitor(void* state)
{
}


void
charout(void* state, char ch) {
}

int
main()
{
	int clk = 0;
    void* state;

	state = initAndResetChip();

	/* set up memory for user program */

	/* emulate the 6502! */
	for (;;) {
		step(state);

		chipStatus(state);
		//if (!(cycle % 1000)) printf("%d\n", cycle);
	};
}
