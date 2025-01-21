#include "libc.h"

void memset_(void* s_, int c, size_t n) {
    char* s = s_;
    for (int i=0; i<n; i++)
        s[i] = c;
}

void* malloc_(size_t size) {
    static char pool[20 * 1024*1024];
    static int used = 0;
    char* result = pool + used;
    used += size + 4 - size%4;
    return result;
}

void* calloc_(size_t nmemb, size_t size) {
    size_t len = nmemb * size;
    void* p = malloc_(len);
    memset_(p, 0, len);
    return p;
}

void free_(void* ptr) {
    /* do nothing */
}
