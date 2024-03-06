export function doSomethingAfterExecute<
  P extends { execute: (...args: any[]) => Promise<any> },
  F extends (result: Awaited<ReturnType<P['execute']>>) => any,
>({ execute, ...preparedStatement }: P, doSomething: F) {
  return {
    ...preparedStatement,
    execute: async (...args: Parameters<P['execute']>) =>
      doSomething(await execute(...args)) as ReturnType<F>,
  }
}
