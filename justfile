#!/usr/bin/env -S just --justfile
# SPDX-FileCopyrightText: 2026 KIM Hyunjae
# SPDX-License-Identifier: AGPL-3.0-or-later

set unstable
set lazy

_:
    @just --list

[group('ci')]
format:
    devenv shell -- treefmt

[group('build')]
build:
    pnpm run build

[group('build')]
package:
    pnpm run xpi

[group('ci')]
typecheck:
    pnpm run typecheck

[group('ci')]
test:
    pnpm run test

[group('ci')]
check:
    devenv tasks run ci:check
