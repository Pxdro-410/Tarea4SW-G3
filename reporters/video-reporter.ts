import { copyFileSync, mkdirSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import type {
  FullConfig,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

type VideoReporterOptions = {
  outputDir?: string;
};

/**
 * Copies Playwright's video attachments to a stable, easy-to-find directory.
 * The HTML reporter keeps its own hash-named copies, so those files are not
 * suitable when the videos need to be opened or submitted individually.
 */
export default class VideoReporter implements Reporter {
  private readonly outputDir: string;

  constructor(options: VideoReporterOptions = {}) {
    this.outputDir = resolve(options.outputDir ?? 'test-results/videos');
  }

  onBegin(_config: FullConfig): void {
    mkdirSync(this.outputDir, { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const videoAttachments = result.attachments.filter(
      ({ contentType, name, path }) =>
        Boolean(path) &&
        (contentType === 'video/webm' || name === 'video' || extname(path!) === '.webm'),
    );

    videoAttachments.forEach((attachment, index) => {
      const extension = extname(attachment.path!) || '.webm';
      const fileName = this.videoFileName(test, result, index, videoAttachments.length, extension);
      copyFileSync(attachment.path!, resolve(this.outputDir, fileName));
    });
  }

  private videoFileName(
    test: TestCase,
    result: TestResult,
    videoIndex: number,
    videoCount: number,
    extension: string,
  ): string {
    const spec = basename(test.location.file, extname(test.location.file));
    const project = test.parent.project()?.name ?? 'project';
    const title = test.titlePath().at(-1) ?? test.title;
    const retry = result.retry > 0 ? `-retry-${result.retry}` : '';
    const part = videoCount > 1 ? `-part-${videoIndex + 1}` : '';
    const rawName = `${spec}-${title}-${project}${retry}${part}`;

    return `${slugify(rawName)}${extension}`;
  }
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}
