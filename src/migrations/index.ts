import * as migration_20261030_004417_initial from './20261030_004417_initial';
import * as migration_20261030_195745_pixieset_layout from './20261030_195745_pixieset_layout';

export const migrations = [
  {
    up: migration_20261030_004417_initial.up,
    down: migration_20261030_004417_initial.down,
    name: '20261030_004417_initial',
  },
  {
    up: migration_20261030_195745_pixieset_layout.up,
    down: migration_20261030_195745_pixieset_layout.down,
    name: '20261030_195745_pixieset_layout'
  },
];
