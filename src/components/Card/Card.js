import React, { useState } from 'react'
import "./Card.css";

const Card = ({pokemon}) => {

    const [currentImage, setCurrentImage] = useState(pokemon.sprites.front_default);
    const [isRotating, setIsRotating] = useState(false);

    const imageSprites = [
        pokemon.sprites.front_default,
        pokemon.sprites.back_default,
        pokemon.sprites.front_female,
        pokemon.sprites.back_female,
        pokemon.sprites.front_shiny,
        pokemon.sprites.back_shiny,
        pokemon.sprites.front_shiny_female,
        pokemon.sprites.back_shiny_female,
    ].filter(sprite => sprite != null);

    const changeImage = () => {

        if(isRotating) {
            console.log("isrotating");
            return;
        }

        setIsRotating(true);

        setTimeout(() => {
            const currentIndex = imageSprites.indexOf(currentImage);
            const nextIndex = (currentIndex + 1 ) % imageSprites.length;
            setCurrentImage(imageSprites[nextIndex]);
            setIsRotating(false);
        }, 250);

        playTouchCry();
    };


    const playLatestCry = () => {
        if(pokemon.cries.latest == null) return;
        const audio = new Audio(pokemon.cries.latest);
        audio.play();
    };

    const playLegacyCry = () => {
        if(pokemon.cries.legacy == null) return;
        const audio = new Audio(pokemon.cries.legacy);
        audio.play();
    };

    const playTouchCry = () => {
        let pokemonCry;
        if(pokemon.cries.legacy == null){
            if(pokemon.cries.latest == null){
                return;
            }
            pokemonCry = pokemon.cries.latest;
        }else{
            pokemonCry = pokemon.cries.legacy;
        }
        const audio = new Audio(pokemonCry);
        audio.volume = 0.2;
        audio.playbackRate = 1.5;
        audio.play();
    };

    return (
    <div className="card">
        <div className="cardImg" onClick={changeImage}>
            <img src={currentImage} alt={pokemon.name} className={isRotating ? 'rotating' : ''}></img>
        </div>
        <h2 className="cardName">{pokemon.name}</h2>

        <div className="criesBtn"> 
            {pokemon.cries.latest && <button onClick={playLatestCry}>鳴き声1</button>}

            {pokemon.cries.legacy ? (
                <button onClick={playLegacyCry}>鳴き声2</button>
            ) : (
                <button className="disbled-btn" disabled>鳴き声2</button>
            )}

            {/*<button onClick={playLatestCry}>鳴き声1</button>*/}
            {/*<button onClick={playLegacyCry}>鳴き声2</button>*/}
        </div>

        <div className="cardTypes">
            <div>タイプ</div>
            {pokemon.types.map((type) => {
                return (
                    <div key={type.type.name}>
                        <span className="typeName">
                            {type.type.name}
                        </span>
                    </div>
                );
            })}
        </div>
        <div className="cardInfo">
            <div className="cardData">
                <p className="title">重さ：{pokemon.weight}</p>
            </div>
            <div className="cardData">
                <p className="title">高さ：{pokemon.height}</p>
            </div>
            <div className="cardData">
                <p className="title">特性：{pokemon.abilities[0].ability.name}</p>
            </div>
            
        </div>
    </div>
    );
};

export default Card
