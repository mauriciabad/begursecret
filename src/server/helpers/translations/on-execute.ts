export function doSomethingAfterExecute<
  P extends { execute: (...args: any[]) => Promise<any> },
  F extends (result: Awaited<ReturnType<P['execute']>>) => any,
>(preparedStatement: P, doSomething: F) {
  // For some strage reason, I have to destructure preparedStatement, but
  // when calling `preparedStatement.execute` I have to use the original
  const { execute, ...rest } = preparedStatement
  return {
    ...rest,
    execute: async (...args: Parameters<P['execute']>) =>
      doSomething(await preparedStatement.execute(...args)) as ReturnType<F>,
  }
}
