import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from './FadeInText';
import './App.css'
import sekiro from '../src/assets/hero.png'
import boss_1 from '../src/assets/boss_1.png'
import boss_2 from '../src/assets/boss_2.png'
import boss_3 from '../src/assets/boss_3.png'
import stances from './fightStances';

const allStances = Array.from({ length: 30 }, (_, i) => ({
	id: i + 1,
	img: stances[i],
	clicked: false,
}));

export default function MemoryGame() {
	const [cards, setCards] = useState([]);
	const [visibleCards, setVisibleCards] = useState([]);
	const [heroHP, setHeroHP] = useState(0);
	const [enemyHP, setEnemyHP] = useState(0);
	const [level, setLevel] = useState(0);
	const [isDead, setIsDead] = useState(false);
	const [isHit, setIsHit] = useState(null);
	const [reflection, setReflection] = useState(null); 
	const [disableClick, setDisableClick] = useState(true);
	const [message, setMessage] = useState('start');
	const [isEnd,setIsEnd] = useState(false);

	const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
	const allCards = shuffle(allStances); 

	const getVisibleCards = (cards) => {
		const unclicked = cards.filter(c => !c.clicked);
		const clicked = cards.filter(c => c.clicked);

		const total = 6;
		const clickedCount = 
			Math.min(clicked.length, enemyHP >= cards.length * 0.4 ? 3 : enemyHP > 2 ? 4 : 5);

		const pickClicked = shuffle(clicked).slice(0, clickedCount);
		const pickUnclicked = shuffle(unclicked).slice(0, total - clickedCount);

		return shuffle([...pickClicked, ...pickUnclicked]);
	}

	const handleClickCard = (id) => {
		if (disableClick) return;

		const clickedCard = cards.find(c => c.id === id);
		if (clickedCard.clicked) {
			setHeroHP(hp => {
				const newHP = hp - 1;
				setIsHit('hero');
				setTimeout(() => setIsHit(null), 500);
				heroHP !== 1 && setReflection('pain'); 
				setTimeout(() => setReflection(null), 1000);

				setDisableClick(true);
				setTimeout(() =>setVisibleCards(getVisibleCards(cards)), 400);

				if (newHP === 0) {
					setTimeout(() => setIsEnd(true), 1000);
					setTimeout(() => setIsDead(true), 2500);
					setTimeout(() => setIsEnd('btn'), 4000);
				} else {
					setTimeout(() => setDisableClick(false), 2500);
				}
				return newHP;
			});
			return;
		}

		const updated = cards.map(c => c.id === id ? {...c, clicked: true} : c);
		setCards(updated);
		setEnemyHP(hp => {
			const newHP = hp - 1;
			setIsHit('enemy');
			setTimeout(() => setIsHit(null), 500);
			newHP === cards.length / 10 && setReflection('smile'); 
			setTimeout(() => setReflection(null), 1000);

			setDisableClick(true);
			!(level === 3 && newHP === 0) && setTimeout(() => setDisableClick(false), newHP === 0 ? 4500 : 2500);
			if (newHP > 0) {
				setTimeout(() => setVisibleCards(getVisibleCards(updated)), 400);
				return newHP;
			} 

			if (level === 3) {			
				setTimeout(() => setIsEnd(true), 2000);
				setTimeout(() => setMessage('end'), 3000);
				setTimeout(() => setIsEnd('btn'), 6000);
			} else {
				setTimeout(() => setLevel(level + 1), 2000);
			}	

			return newHP;
		});
	}

	useEffect(() => {
		if (level <= 1) return;

		if (level === 2) {
			setCards(allCards.slice(0, 20));
			setHeroHP(3);
			setEnemyHP(20);
			setVisibleCards(getVisibleCards(allCards.slice(0, 20)));
		} else if (level === 3) {
			setCards(allCards);
			setHeroHP(4);
			setEnemyHP(30);
			setVisibleCards(getVisibleCards(allCards));
		}
	}, [level]);

	const newGame = () => {
		setTimeout(() => setDisableClick(false), 2500);
		setCards(allCards.slice(0, 10));
		setHeroHP(2);
		setEnemyHP(10);
		setLevel(1);
		
		setIsDead(false);
		setMessage(true);
		setTimeout(() => setMessage(false), 100);
		setIsEnd(true);
		setTimeout(() => setIsEnd(false), 100);
		setVisibleCards(getVisibleCards(allCards.slice(0, 10)));
	}

	return (
		<div 
			className="memoryGame"
			style={{flexDirection: level === 0 && 'column' }}
		>
			<div className="rivals">						
				{isDead ? (
					<div className="messageLeft" >
						<FadeIn messages={['Game Over!!!']} delay={0}/>
						<button
							style={{ visibility: isEnd === 'btn' ? 'visible' : 'hidden' }}																
							onClick={newGame}>
						Start New Game
						</button>
					</div>
				):(
				<motion.div 
					initial={{ opacity: 0 }} 
					animate={{ opacity: heroHP === 0 || level === 0 ? 0 : 1}}
					transition={{duration: 1, easy: 'easeInOut', delay: 1}}
					className={`hero ${isHit === 'hero' ? 'hit' : ''}`}
				>				
					<div 
						style={{ opacity: level > 0 && !isEnd ? 1 : 0 }}
						className={`health ${enemyHP === 0 && level !== 3 && 'levelUP'}`}
					> 												
						{enemyHP === 0 && level !== 3 ? 'Level UP!!!' : heroHP + ' / ' + (level + 1)}
						<div style={{width: 100 / (level + 1) * heroHP + '%'}} className="hpStripe"></div>																					
					</div>
					<div className={`reflection ${reflection === 'pain' && 'pain'} ${reflection === 'smile' && 'smile'}`}></div>																
					<img src={sekiro} alt="" />
				</motion.div>
				)}
				{message ? (
					<div className="messageRight">										
						{message === 'start' &&	(
							<div className='startMessage'>
								<p>Welcome to Sekiro Memory Game!</p>
								<p>When you click a card, the enemy takes damage. 
								   But he remember your attacks, and if you click the same card again, he counterattack.
								   <br/>So be careful and good luck!</p>
							</div>
						)}	
						{message === 'end' && (
							<FadeIn messages={['Congratulations!!!', 'You Win the Game!!!']} />																																						
						)}						
						<button
							style={{ marginBottom: isEnd && 210,
									 visibility: isEnd === 'btn' || !isEnd ? 'visible' : 'hidden' }}																
							onClick={newGame}>
						Start New Game
						</button>
					</div> 
				):(
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: enemyHP === 0 ? 0 : 1 }}  
						transition={{ duration: 1, ease: 'easeInOut', delay: 1 }}
						style={{marginRight: level === 2 && 100 || level === 3 && 90}}
						className={`enemy ${isHit === 'enemy' ? 'hit' : ''} ${enemyHP <= cards.length / 10 && heroHP > 0 ? 'deathblow' : ''} `}
					>
						<div className="health" >											 
							{enemyHP} / {cards.length}
							<div style={{width: 100 / cards.length * enemyHP + '%'}} className="hpStripe"></div>																					
						</div>
						<img 
							style={{ width: level === 2 && 300 || level === 3 && 330,
									height: level === 2 && 250 || level === 3 && 300,
									left: level === 1 && 23 || level === 2 && 30 || level === 3 && -35
							}}
							src={level === 1 ? boss_1 : level === 2 ? boss_2 : boss_3}
						/>
					</motion.div>
				)}
			</div>
			<div className="cards">
				<AnimatePresence>
					{visibleCards.map(card => (
						<motion.div 
							key={card.id}
							layout 
							initial={{opacity:0, scale: 0.8 }}
							animate={{opacity: isEnd ? 0 : 1,  scale: 1 }}
							exit={{opacity:0,  scale: 0.8 }}
							transition={{ duration: 0.8, ease: "easeInOut" }}
							className='card' 
							onClick={() => handleClickCard(card.id)}
							style= {{cursor: disableClick ? 'default' : 'pointer'}}
							whileHover={{
								scale: disableClick ? 1 : 1.1,
								boxShadow: disableClick ? 'none' : "0 0 15px black",
								transition: { duration: 0.2, ease: "easeOut" }  
							}}
						>
							<img src={card.img} alt={`Card ${card.id}`} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}



