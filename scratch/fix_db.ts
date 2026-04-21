import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://hbfhllfpjhgajxroewpu.supabase.co',
  ''
)

async function fix() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: "ALTER TABLE loyalty_transactions DROP CONSTRAINT IF EXISTS loyalty_transactions_type_check; ALTER TABLE loyalty_transactions ADD CONSTRAINT loyalty_transactions_type_check CHECK (type IN ('earn', 'redeem', 'earned', 'redeemed'));"
  })
  if (error) console.error(error)
  else console.log('SQL Executed Successfully')
}

fix()
