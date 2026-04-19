import { supabase } from "../src/integrations/supabase/client";

async function checkVendorsTable() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching vendors:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns in vendors table:', Object.keys(data[0]));
  } else {
    console.log('No data in vendors table, but table exists.');
  }
}

checkVendorsTable();
