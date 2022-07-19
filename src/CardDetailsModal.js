import styled from '@emotion/styled'
import React from 'react'
import { useCardSets } from './CardSetProvider'
import CardSetSymbol from './CardSetSymbol'
import Colors from './Colors'
import LinkButton from './LinkButton'
import Modal from './Modal'

function CardDetailsModal ({ card, ...rest }) {
  const { sets } = useCardSets()

  if (!card) {
    return null
  }

  const set = sets[card.set] || {}

  return (
    <Modal {...rest}>
      <Container>
        <CardImageContainer set={set.code}>
          <CardImage src={card.image_uris.normal} alt={card.name} set={set.code} />
        </CardImageContainer>
        <CardInfo>
          <Table>
            <tbody>
              <tr>
                <td><h1><span>№ {card.collector_number}/<span>{set.card_count}</span></span></h1></td>
                <td><h1>{card.name}</h1></td>
              </tr>
              <tr />
              <tr>
                <td><InfoText>Set:</InfoText></td>
                <td><InfoText><CardSetSymbol code={set.code} /> {set.name}</InfoText></td>
              </tr>
              <tr>
                <td><InfoText>Rarity:</InfoText></td>
                <td><InfoText><Rarity rarity={card.rarity}>{card.rarity.toUpperCase()}</Rarity></InfoText></td>
              </tr>
              <tr>
                <td><InfoText>Released:</InfoText></td>
                <td><InfoText>{new Date(set.released_at).getFullYear()}</InfoText></td>
              </tr>
              <tr>
                <td><InfoText>Reserved:</InfoText></td>
                <td><InfoText><ReservedStatus>{card.reserved ? 'YES' : 'NO'}</ReservedStatus></InfoText></td>
              </tr>
            </tbody>
          </Table>
          <AddContainer>
            <LinkButton.Accept>Add</LinkButton.Accept>
            <LinkButton.Danger>Remove</LinkButton.Danger>
          </AddContainer>
        </CardInfo>
      </Container>
    </Modal>
  )
}

const stripes = `repeating-linear-gradient(
  -45deg,
  ${Colors.backgroundDark},
  ${Colors.backgroundDark} 10px,
  ${Colors.backgroundLight} 10px,
  ${Colors.backgroundLight} 20px
)`

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: 12,
  position: 'relative',
  width: '60%',
  minWidth: 480,
  margin: '10% auto'
})

const CardImageContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  aspectRatio: '488 / 680',
  width: '50%',
  maxWidth: 300,
  background: stripes,
  boxShadow: '0px 0px 4px 0px white'
}, ({ set }) => ({
  borderRadius: (set === 'lea') ? 22 : 14,
  ':before': {
    content: '"[card]"',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: '488 / 680',
    width: '95%',
    borderRadius: (set === 'lea') ? 16 : 8,
    color: Colors.borderLight,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
}))

const CardImage = styled('img')({
  position: 'absolute',
  width: '100%'
}, ({ set }) => ({
  clipPath: (set === 'lea') ? 'inset(0px round 22px)' : 'inset(0px round 14px)'
}))

const CardInfo = styled('div')({
  flex: 1,
  maxWidth: 500,
  'h1': {
    fontSize: 20,
    margin: 0,
    span: {
      marginRight: 8,
      color: Colors.control,
      span: {
        fontSize: 12
      }
    }
  }
})

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  'tr:first-of-type': {
    borderBottom: `1px solid ${Colors.backgroundAccent}`
  },
  'tr:nth-of-type(2)': {
    height: 12
  },
  td: {
    paddingBottom: 4
  }
})

const InfoText = styled('div')({
  color: Colors.control
})

const ReservedStatus = styled('span')({
  fontWeight: 'bold'
}, ({ reserved }) => ({
  color: reserved ? Colors.accept : Colors.error
}))

const Rarity = styled('span')({
  fontWeight: 'bold'
}, ({ rarity }) => ({
  color: Colors[rarity]
}))

const AddContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  margin: '64px 0 24px',
  borderTop: `1px solid ${Colors.backgroundAccent}`
})

export default CardDetailsModal








const testCard = {
  "object": "card",
  "id": "69c3b2a3-0daa-4d42-832d-fcdfda6555ea",
  "oracle_id": "7744bae4-a8b7-44a5-9b4c-0048ad4cc448",
  "multiverse_ids": [
      94
  ],
  "tcgplayer_id": 1025,
  "cardmarket_id": 5280,
  "name": "Air Elemental",
  "lang": "en",
  "released_at": "1993-08-05",
  "uri": "https://api.scryfall.com/cards/69c3b2a3-0daa-4d42-832d-fcdfda6555ea",
  "scryfall_uri": "https://scryfall.com/card/lea/46/air-elemental?utm_source=api",
  "layout": "normal",
  "highres_image": true,
  "image_status": "highres_scan",
  "image_uris": {
      "small": "https://c1.scryfall.com/file/scryfall-cards/small/front/6/9/69c3b2a3-0daa-4d42-832d-fcdfda6555ea.jpg?1559591522",
      "normal": "https://c1.scryfall.com/file/scryfall-cards/normal/front/6/9/69c3b2a3-0daa-4d42-832d-fcdfda6555ea.jpg?1559591522",
      "large": "https://c1.scryfall.com/file/scryfall-cards/large/front/6/9/69c3b2a3-0daa-4d42-832d-fcdfda6555ea.jpg?1559591522",
      "png": "https://c1.scryfall.com/file/scryfall-cards/png/front/6/9/69c3b2a3-0daa-4d42-832d-fcdfda6555ea.png?1559591522",
      "art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/6/9/69c3b2a3-0daa-4d42-832d-fcdfda6555ea.jpg?1559591522",
      "border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/6/9/69c3b2a3-0daa-4d42-832d-fcdfda6555ea.jpg?1559591522"
  },
  "mana_cost": "{3}{U}{U}",
  "cmc": 5,
  "type_line": "Creature — Elemental",
  "oracle_text": "Flying",
  "power": "4",
  "toughness": "4",
  "colors": [
      "U"
  ],
  "color_identity": [
      "U"
  ],
  "keywords": [
      "Flying"
  ],
  "legalities": {
      "standard": "not_legal",
      "future": "not_legal",
      "historic": "legal",
      "gladiator": "legal",
      "pioneer": "legal",
      "explorer": "legal",
      "modern": "legal",
      "legacy": "legal",
      "pauper": "not_legal",
      "vintage": "legal",
      "penny": "legal",
      "commander": "legal",
      "brawl": "not_legal",
      "historicbrawl": "legal",
      "alchemy": "legal",
      "paupercommander": "restricted",
      "duel": "legal",
      "oldschool": "legal",
      "premodern": "legal"
  },
  "games": [
      "paper"
  ],
  "reserved": false,
  "foil": false,
  "nonfoil": true,
  "finishes": [
      "nonfoil"
  ],
  "oversized": false,
  "promo": false,
  "reprint": false,
  "variation": false,
  "set_id": "288bd996-960e-448b-a187-9504c1930c2c",
  "set": "lea",
  "set_name": "Limited Edition Alpha",
  "set_type": "core",
  "set_uri": "https://api.scryfall.com/sets/288bd996-960e-448b-a187-9504c1930c2c",
  "set_search_uri": "https://api.scryfall.com/cards/search?order=set&q=e%3Alea&unique=prints",
  "scryfall_set_uri": "https://scryfall.com/sets/lea?utm_source=api",
  "rulings_uri": "https://api.scryfall.com/cards/69c3b2a3-0daa-4d42-832d-fcdfda6555ea/rulings",
  "prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A7744bae4-a8b7-44a5-9b4c-0048ad4cc448&unique=prints",
  "collector_number": "46",
  "digital": false,
  "rarity": "uncommon",
  "flavor_text": "These spirits of the air are winsome and wild, and cannot be truly contained. Only marginally intelligent, they often substitute whimsy for strategy, delighting in mischief and mayhem.",
  "card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
  "artist": "Richard Thomas",
  "artist_ids": [
      "596b3aac-b331-4e1e-ae41-9ec2d3b653e1"
  ],
  "illustration_id": "67f66b28-3ee8-4ce0-a184-cb3d7c8fdb4f",
  "border_color": "black",
  "frame": "1993",
  "full_art": false,
  "textless": false,
  "booster": true,
  "story_spotlight": false,
  "edhrec_rank": 16152,
  "penny_rank": 6436,
  "prices": {
      "usd": null,
      "usd_foil": null,
      "usd_etched": null,
      "eur": "449.95",
      "eur_foil": null,
      "tix": null
  },
  "related_uris": {
      "gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=94",
      "tcgplayer_infinite_articles": "https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Air+Elemental&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
      "tcgplayer_infinite_decks": "https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Air+Elemental&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
      "edhrec": "https://edhrec.com/route/?cc=Air+Elemental"
  },
  "purchase_uris": {
      "tcgplayer": "https://www.tcgplayer.com/product/1025?page=1&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
      "cardmarket": "https://www.cardmarket.com/en/Magic/Products/Search?referrer=scryfall&searchString=Air+Elemental&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
      "cardhoarder": "https://www.cardhoarder.com/cards?affiliate_id=scryfall&data%5Bsearch%5D=Air+Elemental&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall"
  }
}