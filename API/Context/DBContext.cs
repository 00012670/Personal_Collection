using API.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Context
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> o)
            : base(o)
        {
            Database.EnsureCreated();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Collection> Collections { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<CustomField> CustomFields { get; set; }
        public DbSet<ItemCustomField> ItemCustomFields { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ItemTag> ItemTags { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.Property(e => e.UserId).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });
            modelBuilder.HasDefaultSchema("Users");
            modelBuilder.Entity<Collection>(entity =>
           {
               entity.HasKey(e => e.CollectionId);
               entity.HasOne(e => e.User).WithMany(u => u.Collections).HasForeignKey(e => e.UserId);
               //  entity.HasOne(e => e.Category).WithMany(c => c.Collection).HasForeignKey(e => e.CategoryID);
               //    entity.HasMany(e => e.Items).WithOne(i => i.Collection).HasForeignKey(i => i.CollectionID);
               //    entity.HasMany(e => e.CustomFields).WithOne(f => f.Collection).HasForeignKey(f => f.CollectionID);
           });
            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => e.ItemId);
                // entity.HasOne(e => e.Collection).WithMany(c => c.Items).HasForeignKey(e => e.CollectionID);
                entity.HasMany(e => e.ItemCustomFields).WithOne(icf => icf.Item).HasForeignKey(icf => icf.ItemId);
                entity.HasMany(e => e.Tags).WithOne(it => it.Item).HasForeignKey(it => it.ItemId);
            });

            modelBuilder.Entity<ItemCustomField>(entity =>
             {
                 entity.HasKey(e => new { e.ItemId, e.CustomFieldId });
                 entity.HasOne(e => e.Item)
                     .WithMany(i => i.ItemCustomFields)
                     .HasForeignKey(e => e.ItemId)
                     .OnDelete(DeleteBehavior.Cascade); // Keep cascade delete on Item -> ItemCustomField relationship
                 entity.HasOne(e => e.CustomField)
                     .WithMany(cf => cf.ItemCustomFields)
                     .HasForeignKey(e => e.CustomFieldId)
                     .OnDelete(DeleteBehavior.NoAction); // Change delete behavior to NoAction on CustomField -> ItemCustomField relationship
             });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => e.TagId);
                entity.HasMany(e => e.ItemTags).WithOne(it => it.Tag).HasForeignKey(it => it.TagId);
            });

            modelBuilder.Entity<ItemTag>(entity =>
            {
                entity.HasKey(e => new { e.ItemId, e.TagId });
                entity.HasOne(e => e.Item).WithMany(i => i.Tags).HasForeignKey(e => e.ItemId);
                entity.HasOne(e => e.Tag).WithMany(t => t.ItemTags).HasForeignKey(e => e.TagId);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.CategoryId);
                entity.Property(e => e.CategoryId).ValueGeneratedOnAdd();
            });
        }
    }
}
