import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../store';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// Este hook personalizado permite que você use o hook useSelector com o tipo RootState, garantindo segurança de tipo ao selecionar o estado da store Redux.
// É uma boa prática criar uma versão tipada do useSelector para evitar repetir o tipo Root