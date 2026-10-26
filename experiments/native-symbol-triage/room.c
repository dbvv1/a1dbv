#include <execinfo.h>
#include <stdio.h>
#include <string.h>
#ifndef FIXED
#define FIXED 0
#endif
__attribute__((noinline)) int open_room(const char *room) {
  if (!strcmp(room, "courtyard")) return 0;
  if (FIXED) {
    puts("room missing: remain in menu with retry available");
    return 0;
  }
  void *frames[8];
  int count = backtrace(frames, 8);
  fputs("error: requested room absent; build-label=demo-1.0\n", stderr);
  backtrace_symbols_fd(frames, count, 2);
  return 2;
}
int main(int argc, char **argv) {
  if (argc != 2) { fputs("usage: room <room-id>\n", stderr); return 64; }
  return open_room(argv[1]);
}
