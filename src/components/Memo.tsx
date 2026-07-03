import React from 'react'

export const Memo = () => {
    const [count, setCount] = React.useState(0);
    const user=React.useMemo(() => {
      return {
        name: "Abdullah",
      }
    }, []);
  return (
    <>
    <button onClick={() => setCount(count + 1)}>{count}</button>
    <ReactMemoHeader user={user} />
    </>
  )
}


const ReactMemoHeader = React.memo(({user}: {user: {name: string}}) => {
  console.log('ReactMemoHeader rendered');
    return <h1>{user.name}</h1>;
});
