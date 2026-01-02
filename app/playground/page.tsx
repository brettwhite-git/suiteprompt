'use client';

import CodePlayground from '@/components/interactive/CodePlayground';

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Code Playground
          </h1>
          <p className="text-xl text-gray-600">
            Experiment with NetSuite APIs and SuiteScript code
          </p>
        </div>
        <CodePlayground
          initialCode={`// Welcome to the Code Playground!
// Try writing some NetSuite SuiteScript code here

import record from 'N/record';
import log from 'N/log';

// Example: Load a customer record
const customer = record.load({
  type: record.Type.CUSTOMER,
  id: 123
});

const companyName = customer.getValue({
  fieldId: 'companyname'
});

log.debug('Customer', companyName);`}
          language="typescript"
          templates={[
            {
              name: 'Load Record',
              code: `import record from 'N/record';

const rec = record.load({
  type: record.Type.CUSTOMER,
  id: 123
});

const name = rec.getValue({ fieldId: 'companyname' });`,
            },
            {
              name: 'Create Record',
              code: `import record from 'N/record';

const newRec = record.create({
  type: record.Type.CUSTOMER
});

newRec.setValue({
  fieldId: 'companyname',
  value: 'New Customer'
});

const id = newRec.save();`,
            },
            {
              name: 'Search',
              code: `import search from 'N/search';

const results = search.create({
  type: search.Type.CUSTOMER,
  filters: [
    ['companyname', 'contains', 'Acme']
  ],
  columns: ['companyname', 'email']
}).run();`,
            },
          ]}
        />
      </div>
    </main>
  );
}

