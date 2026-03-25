import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb
} from 'drizzle-orm/pg-core';


export const matchStatusEnum = pgEnum('match_status', [
  'scheduled',
  'live',
  'finished',
]);




export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),

  sport: text('sport').notNull(),

  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),

  status: matchStatusEnum('status').default('scheduled').notNull(),

  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),

  homeScore: integer('home_score').default(0).notNull(),
  awayScore: integer('away_score').default(0).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});



export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),

  matchId: integer('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),

  minute: integer('minute'),        // e.g. 45
  sequence: integer('sequence'),    // ordering within same minute
  period: text('period'),           // e.g. "1H", "2H", "ET"

  eventType: text('event_type'),    // goal, foul, card, etc.

  actor: text('actor'),             // player name
  team: text('team'),               // team name

  message: text('message'),         // commentary text

  metadata: jsonb('metadata'),      // extra structured data

  tags: text('tags').array(),       // e.g. ["goal", "highlight"]

  createdAt: timestamp('created_at').defaultNow().notNull(),
});