export function fmt(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

export function parsePrecoSeguro(v){
  let s=v.replace(/[^\d.,]/g,'');
  const lc=s.lastIndexOf(','), ld=s.lastIndexOf('.');
  if(lc>ld) s=s.replace(/\./g,'').replace(',', '.');
  else if(ld>lc) s=s.replace(/,/g,'');
  return Number(s);
}

export function entradaNumero(str){
  return Number(str.replace(/[^\d]/g,''))/100||0;
}
