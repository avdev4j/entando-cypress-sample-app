INLINE_RUNTIME_CHUNK=false npm run build

pushd build/static/js

mv -f 2*.js vendor.bar-table.js
mv -f main*.js main.bar-table.js
mv -f runtime~main*.js runtime.bar-table.js

popd

serve -l 5002 build
