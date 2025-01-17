import {
  DataIntegrityError,
} from '../errors';
import {
  type InternalQueryMethod,
  type TaggedTemplateLiteralInvocation,
} from '../types';
import {
  createQueryId,
} from '../utilities';
import {
  query,
} from './query';

export const exists: InternalQueryMethod<Promise<boolean>> = async (log, connection, clientConfiguration, slonikSql, inheritedQueryId) => {
  const queryId = inheritedQueryId ?? createQueryId();

  const {
    rows,
  } = await query(
    log,
    connection,
    clientConfiguration,
    {
      sql: 'SELECT EXISTS(' + slonikSql.sql + ')',
      values: slonikSql.values,
    } as TaggedTemplateLiteralInvocation,
    queryId,
  );

  if (rows.length !== 1) {
    log.error({
      queryId,
    }, 'DataIntegrityError');

    throw new DataIntegrityError();
  }

  return Boolean((rows[0] as Record<string, unknown>).exists);
};
