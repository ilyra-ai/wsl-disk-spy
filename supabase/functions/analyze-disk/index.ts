import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { diskData } = await req.json();

    if (!diskData || typeof diskData !== 'string') {
      console.error('Invalid disk data received');
      return new Response(
        JSON.stringify({ error: 'Invalid disk data format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing disk data...');

    // Parse the disk data
    const lines = diskData.trim().split('\n');
    const folders = [];

    for (const line of lines) {
      const match = line.match(/^(\S+)\s+(.+)$/);
      if (match) {
        const [, size, path] = match;
        folders.push({ size, path });
      }
    }

    console.log(`Parsed ${folders.length} folders`);

    // Store in database
    const { data, error } = await supabase
      .from('disk_analyses')
      .insert({
        data: { folders, timestamp: new Date().toISOString() }
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Analysis stored successfully:', data.id);

    // Cleanup old analyses (keep last 50)
    await supabase.rpc('cleanup_old_analyses');

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id,
        foldersCount: folders.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in analyze-disk function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

