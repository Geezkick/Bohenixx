import { createClient } from '@/utils/supabase/server';
import NativeHeader from '@/components/NativeHeader';
import Image from 'next/image';

// Force dynamic rendering since we are fetching from Supabase directly in a Server Component
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active');

  return (
    <>
      <NativeHeader title="Bohenix Products" />
      <main style={{ padding: '6rem 2rem 2rem', minHeight: '100vh', background: '#050505' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Our Ecosystem</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Explore the cutting-edge enterprise platforms powered by Bohenix ONE.
            </p>
          </div>

          {error && (
            <div style={{ padding: '2rem', background: 'rgba(255,51,102,0.1)', color: '#FF3366', borderRadius: '16px', textAlign: 'center' }}>
              Failed to load products. Please ensure your Supabase database is configured correctly.
            </div>
          )}

          {!error && (!products || products.length === 0) && (
            <div style={{ padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', textAlign: 'center' }}>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>No products found</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Products will appear here once added to your Supabase database.</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {products?.map((product: any) => (
              <div 
                key={product.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {product.image_url ? (
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                    <Image src={product.image_url} alt={product.name} width={60} height={60} style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #B14CFF, #00E5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', color: '#fff' }}>
                    {product.name.charAt(0)}
                  </div>
                )}
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>{product.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0, flex: 1 }}>{product.description}</p>
                
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00E5FF' }}>
                    ${parseFloat(product.price).toLocaleString()}
                  </span>
                  <button style={{ background: '#fff', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '99px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                    Get Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
