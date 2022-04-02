import React from "react";
import { Locale, pageSizes } from "react-hook-core";

export function checked(s: string[] | string | undefined, v: string): boolean | undefined {
  if (s) {
    if (Array.isArray(s)) {
      return s.includes(v);
    } else {
      return s === v;
    }
  }
  return false;
}
export function value<T>(obj?: T): T {
  return (obj ? obj : {} as any);
}
export interface LoadingProps {
  error?: any;
}
export interface Props {
  id?: string;
  name?: string;
  size?: number;
  sizes?: number[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}
export function PageSizeSelect(p: Props) {
  const g = p.sizes;
  const s = (!g || g.length === 0 ? pageSizes : g);
  const opts = s.map(pgSize => React.createElement('option', { key: pgSize, value: pgSize }, pgSize));
  return React.createElement('select', { id: p.id, name: p.name, defaultValue: p.size, onChange: p.onChange }, opts);
}
export type OnClick = React.MouseEvent<HTMLElement, MouseEvent>;

export interface Props {
  id?: string;
  name?: string;
  size?: number;
  sizes?: number[];
  pageSizeChanged?: (event: any) => void;
  search?: React.MouseEventHandler<HTMLElement>;
  toggleFilter?: React.MouseEventHandler<HTMLElement>;
  value?: string;
  placeholder?: string;
  inputChange?: (e: any, callback?: (() => void) | undefined, lc?: Locale | undefined) => void
}
export function Search(props: Props) {
  return (
    <>
      <label className='col s12 m4 search-input'>
        <PageSizeSelect size={props.size} sizes={props.sizes} onChange={props.pageSizeChanged} name={props.name} id={props.id} />
        <input type='text' id='q' name='q' value={props.value || ''} onChange={props.inputChange} maxLength={255} placeholder={props.placeholder} />
        <button type='button' className='btn-filter' onClick={props.toggleFilter} />
        <button type='submit' className='btn-search' onClick={props.search} />
      </label>
    </>
  )
}
