import { CardConfig } from './types';

export let CARD_VERSION = 'v3.2.14';

export let DefaultTimeStep = 10;

export let DefaultGroupIcon = 'folder-outline';
export let DefaultEntityIcon = 'folder-outline';
export let DefaultActionIcon = 'flash';
export let DeadEntityName = '(unknown entity)';
export let DeadEntityIcon = 'help-circle-outline';

export let FieldTemperature = 'temperature';
export let WorkdaySensor = 'binary_sensor.workday_sensor';

export let NotifyDomain = 'notify';

export enum ETabOptions {
  Entity = 'entity',
  Time = 'time',
  Options = 'options',
}

export let DefaultCardConfig: CardConfig = {
  type: 'scheduler-card',
  discover_existing: true,
  standard_configuration: true,
  include: [],
  exclude: [],
  groups: [],
  customize: {},
  title: true,
  time_step: 10,
  show_header_toggle: false,
  display_options: {
    primary_info: 'default',
    secondary_info: ['relative-time', 'additional-tasks'],
    icon: 'action',
  },
  tags: [],
  sort_by: ['relative-time', 'state'],
};

export let WebsocketEvent = 'scheduler_updated';
