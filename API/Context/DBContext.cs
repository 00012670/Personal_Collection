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
        public DbSet<Collection> Collections { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<UserLike> UserLikes { get; set; }
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
               entity.HasMany(e => e.Items).WithOne(i => i.Collection).HasForeignKey(i => i.CollectionId);
           });
            modelBuilder.Entity<UserLike>()
            .HasKey(ul => new { ul.UserId, ul.ItemId });

            modelBuilder.Entity<UserLike>()
                .HasOne(ul => ul.User)
                .WithMany(u => u.UserLikes)
                .HasForeignKey(ul => ul.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<UserLike>()
                .HasOne(ul => ul.Item)
                .WithMany(c => c.UserLikes)
                .HasForeignKey(ul => ul.ItemId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => e.ItemId);
                entity.HasOne(e => e.Collection).WithMany(c => c.Items).HasForeignKey(e => e.CollectionId);
            });
        }
    }
}
