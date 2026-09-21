/**
 * Blog posts sourced from https://www.agent-assists.com/
 * Updating this array keeps the portfolio blog section in sync.
 */

const blogPosts = [
    {
        title: 'High-Performance Problem Solving, On a Small Budget!!',
        date: 'Jul 31, 2026',
        image: 'https://cdn-images-1.medium.com/max/1024/1*PY5Iy-NgjWWc9CHlhuatjg.jpeg',
        excerpt: 'How to route AI coding tasks to the cheapest model that can safely move them forward, using OpenCode Go as a practical example.',
        url: 'https://www.agent-assists.com/blog/high-performance-problem-solving-on-a-small-budget.html'
    },
    {
        title: 'Making Claude Code Powerful: A Consolidated Field Guide to Context, Skills, Agents, and Memory',
        date: 'Jun 5, 2026',
        image: 'https://cdn-images-1.medium.com/max/1024/1*KcupPfMprgy6YMsd1NBYOg.png',
        excerpt: 'A practical guide to managing context, using skills vs agents, hooks, CLAUDE.md, and memory in Claude Code.',
        url: 'https://www.agent-assists.com/blog/making-claude-code-powerful-a-consolidated-field-guide-to-context-skills-agents-and-memory.html'
    },
    {
        title: 'The Hidden Quirks of PostgreSQL Partitions, Schemas, Subpartitions, and Permissions',
        date: 'May 6, 2026',
        image: 'https://cdn-images-1.medium.com/max/1024/1*V1XYm0YY8GAF_KMldssZiw.jpeg',
        excerpt: 'A tour of PostgreSQL partitioning sharp edges: schemas, subpartitions, privileges, and catalog queries.',
        url: 'https://www.agent-assists.com/blog/the-hidden-quirks-of-postgresql-partitions-schemas-subpartitions-and-permissions.html'
    },
    {
        title: 'Beyond pg_dump: How YugabyteDB Voyager Turns Familiar Tools into a Migration Engine',
        date: 'Apr 22, 2026',
        image: 'https://cdn-images-1.medium.com/max/1024/0*8n3g4eNEOD6hnHFi',
        excerpt: 'How YugabyteDB Voyager orchestrates pg_dump, pg_restore, Debezium, and the Go pgx driver for migrations.',
        url: 'https://www.agent-assists.com/blog/beyond-pg-dump-how-yugabytedb-voyager-turns-familiar-tools-into-a-migration-engine.html'
    },
    {
        title: 'PostgreSQL Under the Hood: Server, Client Tools, and the Catalog That Ties Them Together',
        date: 'Apr 13, 2026',
        image: 'https://cdn-images-1.medium.com/max/1024/0*ZB0LO1M5Rm2Nbmqv.png',
        excerpt: 'Exploring PostgreSQL\'s client-server architecture, system catalog, wire protocol, psql, pg_dump, and pg_restore.',
        url: 'https://www.agent-assists.com/blog/postgresql-under-the-hood-server-client-tools-and-the-catalog-that-ties-them-together.html'
    }
];

// Expose for both browser and Node test environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = blogPosts;
}
