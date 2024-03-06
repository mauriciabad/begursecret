export function doSomethingAfterExecute<
  P extends { execute: (...args: any[]) => Promise<any> },
  F extends (result: Awaited<ReturnType<P['execute']>>) => any,
  Args extends Parameters<P['execute']>,
>({ execute, ...preparedStatement }: P, doSomething: F) {
  return {
    ...preparedStatement,
    execute: async (...args: Args) =>
      (await doSomething(await execute(...args))) as ReturnType<F>,
  }
}
