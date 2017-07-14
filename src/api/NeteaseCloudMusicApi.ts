import request from 'utils/request'
import config from 'utils/config'
const { collection } = config.apis

export async function favorite () {
  return await request(collection)
}
