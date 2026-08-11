// Side-effect import: reset.css.ts only registers globalStyle rules, so it has
// no exports to pull in. Vanilla Extract emits the CSS when this is processed.
import './reset.css';
