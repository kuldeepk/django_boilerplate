// @ts-ignore
import { UsaStates } from "usa-states";
import { memoize } from "lodash";

export const usaStateOptions = memoize(() =>
  new UsaStates()
    .states
    .map((s: any) => ({
      label: s.name,
      value: s.abbreviation
    })));
