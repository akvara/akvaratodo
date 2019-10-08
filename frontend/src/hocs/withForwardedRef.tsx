import React from 'react';

export interface WithForwardedRef<T = any> {
  forwardedRef: React.Ref<T>;
}

/**
 * Source: https://github.com/acdlite/recompose/issues/640#issuecomment-441109620
 *
 * Used to pass ref forward to child components.
 * Needed for `react-beautiful-dnd`, to pass DOM elements through custom components
 *
 * Read more: https://reactjs.org/docs/forwarding-refs.html
 *
 * @example
 *
 * // Component
 * interface CustomComponentPrivateProps extends WithForwardedRef {}
 *
 * const CustomComponent = ({ forwardedRef }) => <div ref={forwardedRef} />
 *
 * export default recompose(withForwardedRef)(CustomComponent)
 */

const withForwardedRef = <P extends any, R extends any>(
  Comp: React.FunctionComponent<P & { forwardedRef: React.Ref<R> }>,
) => React.forwardRef<R, P>((props, ref) => <Comp {...props} forwardedRef={ref} />);

export default withForwardedRef;
