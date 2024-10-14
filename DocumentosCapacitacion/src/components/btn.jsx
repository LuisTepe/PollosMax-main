import React from 'react';

const btn = ({children, ...props}) => {
return <button {...props}>{children}</button>}
export default btn;