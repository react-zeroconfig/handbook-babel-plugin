import { source } from '@handbook/source';
source('../../c/d/e');
source('c/d/e');
source(require('../../c/d/e'));
source(require('c/d/e'));
source(() => import('../../c/d/e'));
source(() => import('c/d/e'));
