#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Extract fixed OCR matcher functions into isolated red/green Go harnesses.

Source: https://github.com/alibaba/open-code-review
Commit: 375f64cd6f67a48a135da83cfcf59c52669a09cb (Apache-2.0).
Preserves upstream attribution in generated files. The adjacent patch is a
local proposed modification, not an upstream-accepted change. No downloads,
Go compilation, complete upstream Provider, or CLI verification occur here.
"""
import argparse
import hashlib
import json
import pathlib
import subprocess
import sys


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("source", type=pathlib.Path, help="Fixed upstream checkout (unchanged inputs required)")
  parser.add_argument("output", type=pathlib.Path, help="New output directory outside the checkout")
  parser.add_argument("--timeout", type=float, default=30, help="Positive timeout per Git command in seconds (default: 30)")
  args = parser.parse_args(argv)
  if not 0 < args.timeout < float("inf"):
    parser.error("--timeout must be finite and greater than zero")
  source=args.source.resolve()
  out=args.output.resolve()
  if out == source or source in out.parents:
    raise ValueError('Output must be outside the upstream checkout')
  patch=pathlib.Path(__file__).resolve().with_name('ocr-directory-negation.patch')
  fixed='375f64cd6f67a48a135da83cfcf59c52669a09cb'
  def git(*git_args):
    return subprocess.check_output(['git','-C',str(source),*git_args], timeout=args.timeout, stderr=subprocess.PIPE).decode().strip()
  if git('rev-parse','HEAD')!=fixed: raise SystemExit('Wrong upstream HEAD')
  paths=['internal/diff/git.go','internal/diff/gitignore.go','internal/diff/gitignore_test.go','go.sum']
  for name in paths:
    expected=subprocess.check_output(['git','-C',str(source),'show',fixed+':'+name], timeout=args.timeout, stderr=subprocess.PIPE)
    if (source/name).read_bytes()!=expected: raise SystemExit('Modified input: '+name)
  patch.read_bytes()  # Fail before creating output if the adjacent patch is absent.
  out.mkdir(parents=True,exist_ok=False)
  stage=out/'patch-source'; (stage/'internal/diff').mkdir(parents=True)
  (stage/'internal/diff/git.go').write_bytes((source/'internal/diff/git.go').read_bytes())
  subprocess.run(['git','apply','--check',str(patch)],cwd=stage,check=True,timeout=args.timeout,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
  subprocess.run(['git','apply',str(patch)],cwd=stage,check=True,timeout=args.timeout,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
  gitignore=(source/'internal/diff/gitignore.go').read_text()
  existing_tests=(source/'internal/diff/gitignore_test.go').read_text()
  def span(s,a,b): return s[s.index(a):s.index(b,s.index(a))]
  adapter='''// SPDX-License-Identifier: Apache-2.0
  // Copyright 2026 alibaba/open-code-review Contributors
  package diff
  import ("path/filepath";"strings";"github.com/bmatcuk/doublestar/v4")
  // Harness adapter only, not the upstream Provider or a CLI implementation.
  type Provider struct{repoDir string}
  '''
  for label,src in [('red',source/'internal/diff/git.go'),('green',stage/'internal/diff/git.go')]:
    d=out/label; d.mkdir()
    s=src.read_text()
    chunks=[span(s,'var providerDirIgnoreDirs =','// Mode defines'),span(s,'func (p *Provider) isPathExcluded','// partitionDiffs'),span(gitignore,'func ProviderDirPrefix','// LoadGitignorePatterns'),span(gitignore,'func IsPathExcluded','// MatchGitignorePattern'),gitignore[gitignore.index('func MatchGitignorePattern'):]]
    (d/'matcher.go').write_text(adapter+'\n'.join(chunks))
    (d/'oracle_test.go').write_bytes((stage/'internal/diff/gitignore_oracle_test.go').read_bytes())
    selected=span(existing_tests,'func TestIsPathExcluded(t','func TestIsRangeMode(')
    (d/'existing_test.go').write_text('// SPDX-License-Identifier: Apache-2.0\n// Copyright 2026 alibaba/open-code-review Contributors\npackage diff\nimport "testing"\n'+selected)
    (d/'go.mod').write_text('module isolated-matcher\n\ngo 1.26.9\n\nrequire github.com/bmatcuk/doublestar/v4 v4.10.0\n')
    (d/'go.sum').write_text(''.join(x+'\n' for x in (source/'go.sum').read_text().splitlines() if x.startswith('github.com/bmatcuk/doublestar/v4 ')))
    digest=lambda data:hashlib.sha256(data).hexdigest()
    (d/'provenance.json').write_text(json.dumps({'upstream_commit':fixed,'source_sha256':digest(src.read_bytes()),'patch_sha256':digest(patch.read_bytes()),'chunks_sha256':[digest(x.encode()) for x in chunks],'selected_existing_tests_sha256':digest(selected.encode()),'adapter':adapter,'scope':'Isolated exact-source functions, NOT upstream package or CLI verification'},indent=2)+'\n')
  print('Created red and green isolated harnesses. No Go compilation or product verification performed by this extractor.')


if __name__ == "__main__":
  try:
    main()
  except subprocess.TimeoutExpired:
    sys.exit("error: Git command timed out; any partial output is not a verified harness")
  except subprocess.CalledProcessError as error:
    sys.exit(f"error: Git command failed (exit {error.returncode}); any partial output is not a verified harness")
  except (OSError, ValueError) as error:
    sys.exit(f"error: {error}")
